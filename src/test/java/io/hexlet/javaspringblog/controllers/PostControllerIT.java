package io.hexlet.javaspringblog.controllers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.tobedevoured.modelcitizen.spring.ModelFactoryBean;
import io.hexlet.javaspringblog.config.SpringConfigForIT;
import io.hexlet.javaspringblog.models.post.Post;
import io.hexlet.javaspringblog.models.user.User;
import io.hexlet.javaspringblog.repositories.PostRepository;
import io.hexlet.javaspringblog.repositories.UserRepository;
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
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import static io.hexlet.javaspringblog.config.SpringConfigForIT.TEST_PROFILE;
import static io.hexlet.javaspringblog.controllers.PostController.ID;
import static io.hexlet.javaspringblog.controllers.PostController.POST_CONTROLLER_PATH;
import static io.hexlet.javaspringblog.utils.TestUtils.asJson;
import static io.hexlet.javaspringblog.utils.TestUtils.fromJson;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.data.MapEntry.entry;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpHeaders.Entry;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@ActiveProfiles(TEST_PROFILE)
@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = RANDOM_PORT, classes = SpringConfigForIT.class)
@Import({ModelFactoryBean.class})
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@WithMockUser
public class PostControllerIT {

    final static Entry<String, String> AUTH_HEADER_FOR_DEFAULT_USER = entry(AUTHORIZATION, "Basic dGVzdF9lbWFpbDpwd2Q=");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelFactoryBean modelFactoryBean;

    @BeforeAll
    void beforeClass() throws Exception {
        modelFactoryBean.setRegisterBlueprintsByPackage("io.hexlet.javaspringblog.blueprints");
    }

    @AfterEach
    public void tearDown() {
        postRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
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
    public void getById() throws Exception {

        final Post expected = modelFactoryBean.createModel(Post.class);

        final var request = get(POST_CONTROLLER_PATH + ID, expected.getId());

        final MockHttpServletResponse response = mockMvc.perform(request)
                .andExpect(status().isOk())
                .andReturn()
                .getResponse();

        final Post actual = fromJson(response.getContentAsString(), new TypeReference<>() {});
        assertEquals(expected, actual);
    }

    @Test
    public void createPost() throws Exception {

        final Post post = new Post();
        post.setTitle("test title");
        post.setBody("test body");

        final var request = post(POST_CONTROLLER_PATH)
                .content(asJson(post))
                .contentType(APPLICATION_JSON);

        mockMvc.perform(request)
                .andExpect(status().isCreated());

        assertFalse(postRepository.findAll().isEmpty());
    }

    @Test
    public void updatePost() throws Exception {
        final Post toUpdate = modelFactoryBean.createModel(Post.class);

        final var request = put(POST_CONTROLLER_PATH)
                .content(asJson(toUpdate))
                .contentType(APPLICATION_JSON);

        mockMvc.perform(request)
                .andExpect(status().isOk());
    }

    @Test
    public void updatePostFail() throws Exception {
        modelFactoryBean.createModel(User.class);

        final Post toUpdate = modelFactoryBean.createModel(Post.class);

        final var request = put(POST_CONTROLLER_PATH)
                .content(asJson(toUpdate))
                .contentType(APPLICATION_JSON)
                .header(AUTH_HEADER_FOR_DEFAULT_USER.getKey(), AUTH_HEADER_FOR_DEFAULT_USER.getValue());

        mockMvc.perform(request)
                .andExpect(status().isForbidden());
    }

    @Test
    public void deletePost() throws Exception {
        final Post toDelete = modelFactoryBean.createModel(Post.class);
        assertThat(postRepository.findAll()).hasSize(1);

        final var request = delete(POST_CONTROLLER_PATH + ID, toDelete.getId());

        mockMvc.perform(request)
                .andExpect(status().isOk());
        assertThat(postRepository.findAll()).isEmpty();
    }

    @Test
    @WithAnonymousUser
    public void deletePostFail() throws Exception {
        modelFactoryBean.createModel(User.class);
        final Post toDelete = modelFactoryBean.createModel(Post.class);

        final var request = delete(POST_CONTROLLER_PATH + ID, toDelete.getId())
                .header(AUTH_HEADER_FOR_DEFAULT_USER.getKey(), AUTH_HEADER_FOR_DEFAULT_USER.getValue());

        mockMvc.perform(request)
                .andExpect(status().isForbidden());
        assertThat(postRepository.findAll()).isNotEmpty();
    }
}
