package io.hexlet.blog.controller.api;

import static net.javacrumbs.jsonunit.assertj.JsonAssertions.assertThatJson;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
    }

    @Test
    public void testIndex() throws Exception {
        postRepository.save(testPost);
        var result = mockMvc.perform(get("/api/posts").with(token))
                .andExpect(status().isOk())
                .andReturn();
        var body = result.getResponse().getContentAsString();
        assertThatJson(body).isArray();
    }

    @Test
    public void testCreate() throws Exception {
        var dto = postMapper.map(testPost);

        var request = post("/api/posts")
                .with(token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(dto));

        mockMvc.perform(request)
                .andExpect(status().isCreated());

        var post = postRepository.findBySlug(testPost.getSlug()).get();
        assertNotNull(post);
        assertThat(post.getName()).isEqualTo(testPost.getName());
    }

    @Test
    public void testUpdate() throws Exception {
        postRepository.save(testPost);

        var data = new PostUpdateDTO();
        data.setName(JsonNullable.of("new name"));

        var request = put("/api/posts/" + testPost.getId())
                .with(token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(data));

        mockMvc.perform(request)
                .andExpect(status().isOk());

        testPost = postRepository.findById(testPost.getId()).get();
        assertThat(testPost.getName()).isEqualTo(data.getName().get());
    }

    @Test
    public void testUpdateFailed() throws Exception {
        postRepository.save(testPost);

        var data = new PostUpdateDTO();
        data.setName(JsonNullable.of("new name"));

        var request = put("/api/posts/" + testPost.getId())
                .with(jwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(data));

        mockMvc.perform(request)
                .andExpect(status().isForbidden());

        var actualPost = postRepository.findById(testPost.getId()).get();
        assertThat(actualPost.getName()).isEqualTo(testPost.getName());
    }

    @Test
    public void testShow() throws Exception {
        postRepository.save(testPost);

        var request = get("/api/posts/" + testPost.getId()).with(jwt());
        var result = mockMvc.perform(request)
                .andExpect(status().isOk())
                .andReturn();
        var body = result.getResponse().getContentAsString();
        assertThatJson(body).and(
                v -> v.node("slug").isEqualTo(testPost.getSlug()),
                v -> v.node("name").isEqualTo(testPost.getName()),
                v -> v.node("body").isEqualTo(testPost.getBody()));
    }

    @Test
    public void testDestroy() throws Exception {
        postRepository.save(testPost);
        var request = delete("/api/posts/" + testPost.getId()).with(token);
        mockMvc.perform(request)
                .andExpect(status().isNoContent());

        assertThat(postRepository.existsById(testPost.getId())).isEqualTo(false);
    }

    @Test
    public void testDestroyFailed() throws Exception {
        postRepository.save(testPost);
        var request = delete("/api/posts/" + testPost.getId()).with(jwt());
        mockMvc.perform(request)
                .andExpect(status().isForbidden());

        assertThat(postRepository.existsById(testPost.getId())).isEqualTo(true);
    }
}
