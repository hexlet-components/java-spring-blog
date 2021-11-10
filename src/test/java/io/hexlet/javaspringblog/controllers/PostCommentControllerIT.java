package io.hexlet.javaspringblog.controllers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.tobedevoured.modelcitizen.spring.ModelFactoryBean;
import io.hexlet.javaspringblog.config.SpringConfigForIT;
import io.hexlet.javaspringblog.models.post.Post;
import io.hexlet.javaspringblog.models.post.PostComment;
import io.hexlet.javaspringblog.repositories.PostCommentRepository;
import io.hexlet.javaspringblog.repositories.PostRepository;
import java.util.ArrayList;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
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

import static io.hexlet.javaspringblog.config.SpringConfigForIT.TEST_PROFILE;
import static io.hexlet.javaspringblog.controllers.PostCommentController.COMMENT_CONTROLLER_PATH;
import static io.hexlet.javaspringblog.utils.TestUtils.fromJson;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.TestInstance.Lifecycle.PER_CLASS;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@ActiveProfiles(TEST_PROFILE)
@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = RANDOM_PORT, classes = SpringConfigForIT.class)
@Import({ModelFactoryBean.class})
@TestInstance(PER_CLASS)
public class PostCommentControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostCommentRepository commentRepository;

    @Autowired
    private ModelFactoryBean modelFactoryBean;

    @BeforeAll
    void beforeClass() throws Exception {
        modelFactoryBean.setRegisterBlueprintsByPackage("io.hexlet.javaspringblog.blueprints");
    }

    @AfterEach
    public void tearDown() {
        postRepository.deleteAll();
        commentRepository.deleteAll();
    }

    @Test
    @WithMockUser
    public void getAllForPost() throws Exception {
        final Post post = modelFactoryBean.createModel(Post.class);
        final MockHttpServletResponse response = mockMvc.perform(
                get(COMMENT_CONTROLLER_PATH)
                        .param("postId", post.getId().toString())
                ).andExpect(status().isOk())
                .andReturn()
                .getResponse();

        final ArrayList<PostComment> arrayList = fromJson(response.getContentAsString(), new TypeReference<>() {});
        assertThat(arrayList).hasSize(4);
    }
}
