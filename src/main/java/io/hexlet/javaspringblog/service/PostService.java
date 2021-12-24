package io.hexlet.javaspringblog.service;

import io.hexlet.javaspringblog.dto.PostDto;
import io.hexlet.javaspringblog.model.Post;

public interface PostService {
    Post createNewPost(PostDto dto);

    Post updatePost(long id, PostDto dto);
}
