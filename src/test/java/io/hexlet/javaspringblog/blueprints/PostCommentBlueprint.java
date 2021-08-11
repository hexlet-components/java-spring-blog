package io.hexlet.javaspringblog.blueprints;

import com.tobedevoured.modelcitizen.annotation.Blueprint;
import com.tobedevoured.modelcitizen.annotation.Default;
import com.tobedevoured.modelcitizen.spring.annotation.SpringBlueprint;
import io.hexlet.javaspringblog.models.post.PostComment;

@Blueprint(PostComment.class)
@SpringBlueprint(beanClass = PostComment.class)
public class PostCommentBlueprint {

    @Default
    String body = "Comment body";
}
