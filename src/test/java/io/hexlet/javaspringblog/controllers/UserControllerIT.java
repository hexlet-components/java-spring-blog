package io.hexlet.javaspringblog.controllers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.tobedevoured.modelcitizen.spring.ModelFactoryBean;
import io.hexlet.javaspringblog.config.SpringConfigForIT;
import io.hexlet.javaspringblog.dtos.UserRegistrationDto;
import io.hexlet.javaspringblog.models.user.User;
import io.hexlet.javaspringblog.models.user.UserRole;
import io.hexlet.javaspringblog.repositories.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultMatcher;

import static io.hexlet.javaspringblog.config.SpringConfigForIT.TEST_PROFILE;
import static io.hexlet.javaspringblog.controllers.UserController.LOGIN;
import static io.hexlet.javaspringblog.controllers.UserController.REG;
import static io.hexlet.javaspringblog.controllers.UserController.USER_CONTROLLER_PATH;
import static io.hexlet.javaspringblog.utils.TestUtils.asJson;
import static io.hexlet.javaspringblog.utils.TestUtils.fromJson;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@ActiveProfiles(TEST_PROFILE)
@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = RANDOM_PORT, classes = SpringConfigForIT.class)
@Import({ModelFactoryBean.class})
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class UserControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    private final UserRegistrationDto testRegistrationDto = new UserRegistrationDto(
            "email",
            "name",
            "pwd",
            UserRole.USER
    );

    @AfterEach
    public void clear() {
        userRepository.deleteAll();
    }

    @Test
    public void register() throws Exception {
        final var response = makeRegistrationRequest(
                testRegistrationDto,
                status().isCreated()
        );

        assertEquals(1, userRepository.count());

        final User actual = fromJson(response.getContentAsString(), new TypeReference<>() {});
        final User expected = userRepository.findById(actual.getId()).orElse(null);
        assertEquals(expected, actual);
    }

    @Test
    public void twiceRegTheSameUser() throws Exception {
        makeRegistrationRequest(testRegistrationDto, status().isCreated());
        makeRegistrationRequest(testRegistrationDto, status().isBadRequest());

        assertEquals(1, userRepository.count());
    }

    @Test
    @WithMockUser
    public void login() throws Exception {
        mockMvc.perform(post(USER_CONTROLLER_PATH + LOGIN))
                .andExpect(status().isOk());
    }

    @Test
    public void loginFail() throws Exception {
        mockMvc.perform(post(USER_CONTROLLER_PATH + LOGIN))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void deleteUser() throws Exception {
        final var response = makeRegistrationRequest(
                testRegistrationDto,
                status().isCreated()
        );

        final Long userId = fromJson(response.getContentAsString(), new TypeReference<User>() {}).getId();

        mockMvc.perform(delete(USER_CONTROLLER_PATH + "/" + userId))
                .andExpect(status().isOk());

        assertEquals(0, userRepository.count());
    }

    @Test
    @WithMockUser
    public void deleteUserFails() throws Exception {
        final var response = makeRegistrationRequest(
                testRegistrationDto,
                status().isCreated()
        );

        final Long userId = fromJson(response.getContentAsString(), new TypeReference<User>() {}).getId();

        mockMvc.perform(delete(USER_CONTROLLER_PATH + "/" + userId))
                .andExpect(status().isForbidden());

        assertEquals(1, userRepository.count());
    }

    private MockHttpServletResponse makeRegistrationRequest(final UserRegistrationDto dto,
                                                            final ResultMatcher expectedStatus) throws Exception {
        final var requestBody = post(USER_CONTROLLER_PATH + REG)
                .content(asJson(dto))
                .contentType(APPLICATION_JSON);

        return mockMvc.perform(requestBody)
                .andExpect(expectedStatus)
                .andReturn()
                .getResponse();

    }
}
