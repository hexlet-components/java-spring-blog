package io.hexlet.blog.controller.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import io.hexlet.blog.dto.UserCreateDTO;
import io.hexlet.blog.dto.UserDTO;
import io.hexlet.blog.dto.UserUpdateDTO;
import io.hexlet.blog.mapper.UserMapper;
import org.assertj.core.api.Assertions;
import org.instancio.Instancio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.JwtRequestPostProcessor;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.hexlet.blog.model.User;
import io.hexlet.blog.repository.UserRepository;
import io.hexlet.blog.util.ModelGenerator;
import net.datafaker.Faker;


@SpringBootTest
@AutoConfigureMockMvc
public class UsersControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private Faker faker;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelGenerator modelGenerator;

    @Autowired
    private ObjectMapper om;

    @Autowired
    private UserMapper userMapper;

    private JwtRequestPostProcessor token;

    private User testUser;


    @BeforeEach
    public void setUp() {
        token = jwt().jwt(builder -> builder.subject("hexlet@example.com"));
        testUser = Instancio.of(modelGenerator.getUserModel())
                .create();
        userRepository.save(testUser);
    }

    @Test
    public void testShow() throws Exception {
        var response = mockMvc.perform(get("/api/users/"
                        + testUser.getId()).with(jwt()))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse();

        String body = response.getContentAsString();

        UserDTO userDTO = om.readValue(body, UserDTO.class);

        User user = userMapper.map(userDTO);

        assertThat(user.getEmail()).isEqualTo(testUser.getEmail());
        assertThat(user.getFirstName()).isEqualTo(testUser.getFirstName());
        assertThat(user.getLastName()).isEqualTo(testUser.getLastName());
    }

    @Test
    public void testIndex() throws Exception {
        var response = mockMvc.perform(get("/api/users").with(jwt()))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse();

        String body = response.getContentAsString();

        List<UserDTO> userDTOS = om.readValue(body, new TypeReference<>() {});

        List<User> actual = userDTOS.stream().map(userMapper::map).toList();
        List<User> expected = userRepository.findAll();

        Assertions.assertThat(actual).containsAll(expected);
    }

    @Test
    public void testCreate() throws Exception {

        var createDTO = new UserCreateDTO();
        createDTO.setEmail("testMail@example.com");
        createDTO.setPassword("testPassword");
        createDTO.setFirstName("Alice");
        createDTO.setLastName("Fox");

        var request = post("/api/users")
                .with(token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(createDTO));

        mockMvc.perform(request)
                .andExpect(status().isCreated());

        var actualUser = userRepository.findByEmail(createDTO.getEmail()).orElseThrow();

        assertNotNull(actualUser);
        assertThat(actualUser.getFirstName()).isEqualTo(createDTO.getFirstName());
        assertThat(actualUser.getLastName()).isEqualTo(createDTO.getLastName());
    }

    @Test
    public void testUpdate() throws Exception {

        var updateDTO = new UserUpdateDTO();
        updateDTO.setFirstName("Mike");

        var request = put("/api/users/" + testUser.getId()).with(token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(updateDTO));

        mockMvc.perform(request)
                .andExpect(status().isOk());

        var actualUser = userRepository.findById(testUser.getId()).orElseThrow();

        assertThat(actualUser.getFirstName()).isEqualTo((updateDTO.getFirstName()));
    }
}
