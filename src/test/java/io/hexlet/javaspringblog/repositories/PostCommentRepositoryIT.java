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

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.TestInstance.Lifecycle.PER_CLASS;

@DataJpaTest
@Import({AuditConfiguration.class, ModelFactoryBean.class})
@TestInstance(PER_CLASS)
class PostCommentRepositoryIT {

    @Autowired
    private PostCommentRepository postCommentRepository;

    @Autowired
    private ModelFactoryBean modelFactoryBean;

    @BeforeAll
    void beforeClass() throws Exception {
        modelFactoryBean.setRegisterBlueprintsByPackage("io.hexlet.javaspringblog.blueprints");
    }

    @Test
    void testFindAllCommentsForPostId() throws Exception {
        modelFactoryBean.createModel(Post.class);
        modelFactoryBean.createModel(Post.class);
        final var expectedPost = modelFactoryBean.createModel(Post.class);
        final var expectedComments = expectedPost.getPostComments();

        final var actualComments = postCommentRepository.findAllByPostId(expectedPost.getId());

        assertThat(actualComments).hasSize(expectedComments.size());
        assertThat(actualComments).containsAll(expectedComments);
    }
}
