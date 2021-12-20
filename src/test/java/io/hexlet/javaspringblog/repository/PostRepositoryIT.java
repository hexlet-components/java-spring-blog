package io.hexlet.javaspringblog.repositories;

import com.tobedevoured.modelcitizen.spring.ModelFactoryBean;
import io.hexlet.javaspringblog.config.audit.AuditConfiguration;
import io.hexlet.javaspringblog.models.post.Post;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;

import static io.hexlet.javaspringblog.models.post.PostStatus.CREATED;
import static io.hexlet.javaspringblog.models.post.PostStatus.HIDDEN;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.TestInstance.Lifecycle.PER_CLASS;

@DataJpaTest
@Import({AuditConfiguration.class, ModelFactoryBean.class})
@TestInstance(PER_CLASS)
@WithMockUser
class PostRepositoryIT {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private ModelFactoryBean modelFactoryBean;

    @BeforeAll
    void beforeClass() throws Exception {
        modelFactoryBean.setRegisterBlueprintsByPackage("io.hexlet.javaspringblog.blueprints");
    }

    @Test
    void testFindAllPosts() throws Exception {
        final var expectedOne = modelFactoryBean.createModel(Post.class);
        final var expectedTwo = modelFactoryBean.createModel(Post.class);
        final var actualPosts = postRepository.findAll();
        assertThat(actualPosts).hasSize(2);
        assertThat(actualPosts).contains(expectedOne, expectedTwo);
    }

    @Test
    void testFindPostsByPostStatusNot() throws Exception {
        var expected = new Post();
        expected.setPostStatus(HIDDEN);
        expected = modelFactoryBean.createModel(expected);

        modelFactoryBean.createModel(Post.class);
        modelFactoryBean.createModel(Post.class);

        var actualPosts = postRepository.findPostsByPostStatusNot(CREATED);
        assertThat(actualPosts).hasSize(1);
        assertThat(actualPosts).containsOnly(expected);
    }
}
