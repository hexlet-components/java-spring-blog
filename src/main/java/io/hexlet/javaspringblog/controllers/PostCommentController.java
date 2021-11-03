package io.hexlet.javaspringblog.controllers;

import io.hexlet.javaspringblog.models.post.PostComment;
import io.hexlet.javaspringblog.repositories.PostCommentRepository;
import java.util.List;
import javax.validation.Valid;
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
    public static final String ID = "{id}";

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
    public PostComment updateComment(@Valid @RequestBody final PostComment comment) {
        return commentRepository.save(comment);
    }

    @DeleteMapping(ID)
    public void deleteComment(@PathVariable final Long id) {
        commentRepository.deleteById(id);
    }
}
