package io.hexlet.javaspringblog.controllers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.tobedevoured.modelcitizen.spring.ModelFactoryBean;
import io.hexlet.javaspringblog.config.SpringConfigForIT;
import io.hexlet.javaspringblog.models.post.Post;
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
import static io.hexlet.javaspringblog.controllers.PostController.POST_CONTROLLER_PATH;
import static io.hexlet.javaspringblog.utils.TestUtils.asJson;
import static io.hexlet.javaspringblog.utils.TestUtils.fromJson;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@ActiveProfiles(TEST_PROFILE)
@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = RANDOM_PORT, classes = SpringConfigForIT.class)
@Import({ModelFactoryBean.class})
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class PostControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private ModelFactoryBean modelFactoryBean;

    @BeforeAll
    void beforeClass() throws Exception {
        modelFactoryBean.setRegisterBlueprintsByPackage("io.hexlet.javaspringblog.blueprints");
    }

    @AfterEach
    public void tearDown() {
        postRepository.deleteAll();
    }

    @Test
    @WithMockUser
    public void getAll() throws Exception {
        final int postsToCreate = 3;
        for (int i = 0; i < postsToCreate; i++) {
            modelFactoryBean.createModel(Post.class);
        }
        final MockHttpServletResponse response = mockMvc.perform(get(POST_CONTROLLER_PATH))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse();

        final ArrayList<Post> posts = fromJson(response.getContentAsString(), new TypeReference<>() {});
        assertThat(posts).hasSize(postsToCreate);
    }

    @Test
    @WithMockUser
    public void getById() throws Exception {

        final Post expected = modelFactoryBean.createModel(Post.class);

        final MockHttpServletResponse response = mockMvc.perform(get(POST_CONTROLLER_PATH + "/" + expected.getId()))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse();

        final Post actual = fromJson(response.getContentAsString(), new TypeReference<>() {});
        assertEquals(expected, actual);
    }

    @Test
    @WithMockUser
    public void createPost() throws Exception {

        final Post post = new Post();
        post.setTitle("test title");
        post.setBody("test body");

        mockMvc.perform(
                post(POST_CONTROLLER_PATH)
                        .content(asJson(post))
                        .contentType(APPLICATION_JSON)
        ).andExpect(status().isCreated());

        assertFalse(postRepository.findAll().isEmpty());
    }

    @Test
    @WithMockUser
    public void deletePost() throws Exception {
        final Post toDelete = modelFactoryBean.createModel(Post.class);
        assertThat(postRepository.findAll()).hasSize(1);

        mockMvc.perform(delete(POST_CONTROLLER_PATH + "/" + toDelete.getId()));
        assertThat(postRepository.findAll()).isEmpty();
    }

}
