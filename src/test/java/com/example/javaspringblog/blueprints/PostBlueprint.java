package com.example.javaspringblog.blueprints;

import com.example.javaspringblog.models.Post;
import com.tobedevoured.modelcitizen.annotation.Blueprint;
import com.tobedevoured.modelcitizen.annotation.Default;

@Blueprint(Post.class)
public class PostBlueprint {

    @Default
    String title = "Title";

    @Default
    String body = "body";
}
