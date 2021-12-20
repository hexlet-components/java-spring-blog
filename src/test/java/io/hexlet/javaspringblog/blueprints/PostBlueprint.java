package io.hexlet.javaspringblog.blueprints;

import com.tobedevoured.modelcitizen.annotation.Blueprint;
import com.tobedevoured.modelcitizen.annotation.Default;
import com.tobedevoured.modelcitizen.annotation.MappedSet;
import com.tobedevoured.modelcitizen.callback.AfterCreateCallback;
import com.tobedevoured.modelcitizen.spring.annotation.SpringBlueprint;
import io.hexlet.javaspringblog.models.post.Post;
import io.hexlet.javaspringblog.models.post.PostComment;
import io.hexlet.javaspringblog.repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Set;

@Blueprint(Post.class)
@SpringBlueprint(beanClass = Post.class)
public class PostBlueprint {

    @Autowired
    PostRepository postRepository;

    @Default
    String title = "Post title";

    @Default
    String body = "Post body";

    @MappedSet(target = PostComment.class, size = 4)
    Set<PostComment> postComments;

    AfterCreateCallback<Post> afterCreateCallback = new AfterCreateCallback<>() {
        public Post afterCreate(Post model) {
            model.getPostComments().forEach(model::addComment);
            return postRepository.save(model);
        }
    };
}
