package io.hexlet.javaspringblog.controllers;

import io.hexlet.javaspringblog.models.post.PostComment;
import io.hexlet.javaspringblog.repositories.PostCommentRepository;
import java.util.List;
import javax.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static io.hexlet.javaspringblog.controllers.PostCommentController.COMMENT_CONTROLLER_PATH;

@RestController
@RequestMapping(COMMENT_CONTROLLER_PATH)
public class PostCommentController {

    public static final String COMMENT_CONTROLLER_PATH = "/comments";
    public static final String ID = "/{id}";

    private static final String ONLY_COMMENT_OWNER_BY_ID = """
            @commentRepository.findById(#id).get().getCreatedBy() == authentication.getName()
        """;

    private static final String ONLY_COMMENT_OWNER_BY_DTO = """
            @commentRepository.findById(#newComment.getId()).get().getCreatedBy() == authentication.getName()
        """;


    private final PostCommentRepository commentRepository;

    public PostCommentController(final PostCommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @GetMapping
    public List<PostComment> getAllCommentsForPost(@RequestParam final Long postId) {
        return commentRepository.findAllByPostId(postId);
    }

    @GetMapping(ID)
    public PostComment getCommentById(@PathVariable final Long id) {
        return commentRepository.findById(id).get();
    }

    @PostMapping
    public PostComment createComment(@Valid @RequestBody final PostComment comment) {
        return commentRepository.save(comment);
    }

    @PutMapping
    @PreAuthorize(ONLY_COMMENT_OWNER_BY_DTO)
    public PostComment updateComment(@Valid @RequestBody final PostComment newComment) {
        final PostComment oldComment = commentRepository.findById(newComment.getId()).get();
        oldComment.setBody(newComment.getBody());
        return commentRepository.save(oldComment);
    }

    @DeleteMapping(ID)
    @PreAuthorize(ONLY_COMMENT_OWNER_BY_ID)
    public void deleteComment(@PathVariable final Long id) {
        commentRepository.deleteById(id);
    }
}
