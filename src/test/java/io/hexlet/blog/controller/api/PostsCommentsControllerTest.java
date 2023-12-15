package io.hexlet.blog.controller.api;

import static net.javacrumbs.jsonunit.assertj.JsonAssertions.assertThatJson;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.instancio.Instancio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.JwtRequestPostProcessor;
import org.springframework.test.web.servlet.MockMvc;

import io.hexlet.blog.model.Post;
import io.hexlet.blog.repository.PostCommentRepository;
import io.hexlet.blog.repository.PostRepository;
import io.hexlet.blog.util.ModelGenerator;
import io.hexlet.blog.util.UserUtils;
import jakarta.transaction.Transactional;

import java.nio.charset.StandardCharsets;

@SpringBootTest
@Transactional
@AutoConfigureMockMvc
public class PostsCommentsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ModelGenerator modelGenerator;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostCommentRepository postCommentRepository;

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

        var testPost2 = Instancio.of(modelGenerator.getPostModel())
                .create();
        testPost2.setAuthor(userUtils.getTestUser());
        postRepository.save(testPost2);

        var testPostComment = Instancio.of(modelGenerator.getPostCommentModel()).create();
        testPostComment.setPost(testPost);
        testPostComment.setAuthor(userUtils.getTestUser());
        postCommentRepository.save(testPostComment);

        var testPostComment2 = Instancio.of(modelGenerator.getPostCommentModel()).create();
        testPostComment2.setPost(testPost2);
        testPostComment2.setAuthor(userUtils.getTestUser());
        postCommentRepository.save(testPostComment2);
    }

    @Test
    public void testIndex() throws Exception {
        var result = mockMvc.perform(get("/api/posts_comments").with(token))
                .andExpect(status().isOk())
                .andReturn();
        var body = result.getResponse().getContentAsString(StandardCharsets.UTF_8);
        assertThatJson(body)
            .node("content")
            .isArray()
            .hasSize(2);
    }

    @Test
    public void testFilteredIndex() throws Exception {
        var result = mockMvc.perform(get("/api/posts_comments?postId=" + testPost.getId()).with(token))
                .andExpect(status().isOk())
                .andReturn();
        var body = result.getResponse().getContentAsString(StandardCharsets.UTF_8);
        assertThatJson(body)
            .node("content")
            .isArray()
            .hasSize(1);
    }
}

