package io.hexlet.blog.controller.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.core.type.TypeReference;
import io.hexlet.blog.dto.PostCreateDTO;
import io.hexlet.blog.dto.PostDTO;
import org.assertj.core.api.Assertions;
import org.instancio.Instancio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openapitools.jackson.nullable.JsonNullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.JwtRequestPostProcessor;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.hexlet.blog.dto.PostUpdateDTO;
import io.hexlet.blog.mapper.PostMapper;
import io.hexlet.blog.model.Post;
import io.hexlet.blog.repository.PostRepository;
import io.hexlet.blog.util.ModelGenerator;
import io.hexlet.blog.util.UserUtils;

import java.util.List;


@SpringBootTest
@AutoConfigureMockMvc
public class PostsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper om;

    @Autowired
    private PostMapper postMapper;

    @Autowired
    private ModelGenerator modelGenerator;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserUtils userUtils;

    private JwtRequestPostProcessor token;

    private Post testPost;


    @BeforeEach
    public void setUp() {
        token = jwt().jwt(builder -> builder.subject("hexlet@example.com"));
        testPost = Instancio.of(modelGenerator.getPostModel())
                .create();
        testPost.setAuthor(userUtils.getTestUser());
        postRepository.save(testPost);
    }

    @Test
    public void testShow() throws Exception {
        var request = get("/api/posts/" + testPost.getId()).with(jwt());

        var response = mockMvc.perform(request)
                .andExpect(status().isOk())
                .andReturn()
                .getResponse();

        String body = response.getContentAsString();

        PostDTO postDTO = om.readValue(body, PostDTO.class);
        PostDTO testPostDTO = postMapper.map(testPost);

        assertThat(postDTO.getName()).isEqualTo(testPostDTO.getName());
        assertThat(postDTO.getSlug()).isEqualTo(testPostDTO.getSlug());
        assertThat(postDTO.getBody()).isEqualTo(testPostDTO.getBody());
    }

    @Test
    public void testIndex() throws Exception {
        var response = mockMvc.perform(get("/api/posts").with(token))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse();

        String body = response.getContentAsString();

        List<PostDTO> postDTOS = om.readValue(body, new TypeReference<>() {});

        List<Post> actual = postDTOS.stream().map(postMapper::map).toList();
        List<Post> expected = postRepository.findAll();

        Assertions.assertThat(actual).containsAll(expected);
    }

    @Test
    public void testCreate() throws Exception {

        var createDTO = new PostCreateDTO();
        createDTO.setName("TestNameForPost");
        createDTO.setBody("TestBodyForPost");
        createDTO.setSlug("TestSlug");
        createDTO.setAuthorId(userUtils.getTestUser().getId());


        var request = post("/api/posts")
                .with(token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(createDTO));

        mockMvc.perform(request)
                .andExpect(status().isCreated());

        var actualPost = postRepository.findBySlug(createDTO.getSlug()).orElseThrow();

        assertNotNull(actualPost);
        assertThat(actualPost.getName()).isEqualTo(createDTO.getName());
    }

    @Test
    public void testUpdate() throws Exception {

        var postUpdateDTO = new PostUpdateDTO();
        postUpdateDTO.setName(JsonNullable.of("new name"));

        mockMvc.perform(put("/api/posts/" + testPost.getId())
                        .with(token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(postUpdateDTO)))
                .andExpect(status().isOk());

        var actualPost = postRepository.findById(testPost.getId()).orElseThrow();

        assertThat(actualPost.getName()).isEqualTo(postUpdateDTO.getName().get());
    }

    @Test
    public void testUpdateFailed() throws Exception {

        var postUpdateDTO = new PostUpdateDTO();
        postUpdateDTO.setName(JsonNullable.of("new name"));

        var request = put("/api/posts/" + testPost.getId())
                .with(jwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(postUpdateDTO));

        mockMvc.perform(request)
                .andExpect(status().isForbidden());

        var actualPost = postRepository.findById(testPost.getId()).orElseThrow();

        assertThat(actualPost.getName()).isEqualTo(testPost.getName());
    }

    @Test
    public void testDestroy() throws Exception {
        var request = delete("/api/posts/" + testPost.getId()).with(token);

        mockMvc.perform(request)
                .andExpect(status().isNoContent());

        assertThat(postRepository.existsById(testPost.getId())).isEqualTo(false);
    }

    @Test
    public void testDestroyFailed() throws Exception {
        var request = delete("/api/posts/" + testPost.getId()).with(jwt());

        mockMvc.perform(request)
                .andExpect(status().isForbidden());

        assertThat(postRepository.existsById(testPost.getId())).isEqualTo(true);
    }
}
