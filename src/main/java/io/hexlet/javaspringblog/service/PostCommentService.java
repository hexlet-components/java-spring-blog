package io.hexlet.javaspringblog.service;

import io.hexlet.javaspringblog.dto.PostCommentDto;
import io.hexlet.javaspringblog.model.PostComment;

public interface PostCommentService {
    PostComment createNewPostComment(PostCommentDto dto);

    PostComment updatePostComment(long id, PostCommentDto dto);
}
