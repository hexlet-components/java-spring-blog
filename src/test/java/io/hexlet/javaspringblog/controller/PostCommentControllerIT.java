package io.hexlet.javaspringblog.controller;

import io.hexlet.javaspringblog.config.SpringConfigForIT;
import io.hexlet.javaspringblog.dto.PostCommentDto;
import io.hexlet.javaspringblog.model.Post;
import io.hexlet.javaspringblog.repository.PostCommentRepository;
import io.hexlet.javaspringblog.repository.PostRepository;
import io.hexlet.javaspringblog.utils.TestUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static io.hexlet.javaspringblog.config.SpringConfigForIT.TEST_PROFILE;
import static io.hexlet.javaspringblog.controller.PostCommentController.COMMENT_CONTROLLER_PATH;
import static io.hexlet.javaspringblog.utils.TestUtils.TEST_USERNAME;
import static io.hexlet.javaspringblog.utils.TestUtils.asJson;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@ActiveProfiles(TEST_PROFILE)
@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = RANDOM_PORT, classes = SpringConfigForIT.class)
public class PostCommentControllerIT {

    @Autowired
    private PostCommentRepository postCommentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private TestUtils utils;

    @BeforeEach
    public void before() throws Exception {
        utils.regDefaultUser();
    }


    @AfterEach
    public void clear() {
        utils.tearDown();
    }

    private PostCommentDto buildComment(final long postId) {
        return new PostCommentDto("my comment", postId);
    }

    @Test
    public void createPostComment() throws Exception {
        final Long postId = createNewPost().getId();

        final var postCommentDto = buildComment(postId);
        final var request = post(COMMENT_CONTROLLER_PATH)
                .content(asJson(postCommentDto))
                .contentType(APPLICATION_JSON);
        utils.perform(request, TEST_USERNAME).andExpect(status().isCreated());
    }

    private Post createNewPost() {

        return postRepository.save(Post.builder()
                                           .author(utils.getUserByEmail(TEST_USERNAME))
                                           .title("post title")
                                           .body("my test post")
                                           .build()
        );
    }

}
