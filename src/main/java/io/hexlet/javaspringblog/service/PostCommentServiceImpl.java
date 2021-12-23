package io.hexlet.javaspringblog.service;

import io.hexlet.javaspringblog.dto.PostCommentDto;
import io.hexlet.javaspringblog.model.PostComment;
import io.hexlet.javaspringblog.model.Post;
import io.hexlet.javaspringblog.model.User;
import io.hexlet.javaspringblog.repository.PostCommentRepository;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class PostCommentServiceImpl implements PostCommentService {

    private final PostCommentRepository postCommentRepository;
    private final UserService userService;

    @Override
    public PostComment createNewPostComment(final PostCommentDto dto) {
        final PostComment newPostComment = fromDto(dto);
        return postCommentRepository.save(newPostComment);
    }

    @Override
    public PostComment updatePostComment(final long id, final PostCommentDto dto) {
        final PostComment postComment = postCommentRepository.findById(id).get();
        merge(postComment, dto);
        return postCommentRepository.save(postComment);
    }

    private void merge(final PostComment postComment, final PostCommentDto postCommentDto) {
        final PostComment newPostComment = fromDto(postCommentDto);
        postComment.setBody(newPostComment.getBody());
    }

    private PostComment fromDto(final PostCommentDto dto) {
        final User author = userService.getCurrentUser();

        return PostComment.builder()
                .author(author)
                .body(dto.getBody())
                .build();
    }
}
