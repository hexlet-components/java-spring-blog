package io.hexlet.blog.controller.api;

import static net.javacrumbs.jsonunit.assertj.JsonAssertions.assertThatJson;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.hexlet.blog.dto.PostCommentDTO;
import io.hexlet.blog.mapper.PostCommentMapper;
import org.assertj.core.api.Assertions;
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
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;


@SpringBootTest
@Transactional
@AutoConfigureMockMvc
public class PostsCommentsControllerTest {

    @Autowired
    private WebApplicationContext wac;

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

    @Autowired
    private ObjectMapper om;

    @Autowired
    private PostCommentMapper postCommentMapper;


    @BeforeEach
    public void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac)
                .defaultResponseCharacterEncoding(StandardCharsets.UTF_8)
                .apply(springSecurity())
                .build();

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
        var body = result.getResponse().getContentAsString();

        Map<String, Object> content = om.readValue(body, new TypeReference<>() {});
        var postComments = content.get("content");

        List<PostCommentDTO> postCommentDTOS = om.convertValue(postComments, new TypeReference<>() {});

        var actual = postCommentDTOS.stream().map(postCommentMapper::map).toList();
        var expected = postCommentRepository.findAll();
        Assertions.assertThat(actual).containsExactlyInAnyOrderElementsOf(expected);
    }

    @Test
    public void testFilteredIndex() throws Exception {
        var result = mockMvc.perform(get("/api/posts_comments?postId=" + testPost.getId()).with(token))
                .andExpect(status().isOk())
                .andReturn();
        var body = result.getResponse().getContentAsString();
        assertThatJson(body)
                .node("content")
                .isArray()
                .hasSize(1);
    }
}
