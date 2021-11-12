package io.hexlet.javaspringblog.controllers;

import io.hexlet.javaspringblog.models.post.PostComment;
import io.hexlet.javaspringblog.repositories.PostCommentRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

    @Operation(summary = "Get All Comments for Post")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Post found"),
            @ApiResponse(responseCode = "404", description = "Post with that id not found")
    })
    @GetMapping
    public List<PostComment> getAllCommentsForPost(
            @Parameter(description = "Id of post comment for which should be found")
            @RequestParam
            final Long postId) {
        return commentRepository.findAllByPostId(postId);
    }

    @Operation(summary = "Get Exact Comment by Id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Comment found"),
            @ApiResponse(responseCode = "404", description = "Comment with that id not found")
    })
    @GetMapping(ID)
    public PostComment getCommentById(@Parameter(description = "Comment id") @PathVariable final Long id) {
        return commentRepository.findById(id).get();
    }

    @Operation(summary = "Create New Comment")
    @ApiResponse(responseCode = "201", description = "Comment created")
    @PostMapping
    public PostComment createComment(
            @Parameter(description = "Comment to save")
            @Valid
            @RequestBody
            final PostComment comment) {
        return commentRepository.save(comment);
    }

    @Operation(summary = "Update Existing Comment")
    @ApiResponse(responseCode = "200", description = "Comment updated")
    @PutMapping
    public PostComment updateComment(
            @Parameter(description = "Comment to update")
            @Valid
            @RequestBody
            final PostComment comment) {
        return commentRepository.save(comment);
    }

    @Operation(summary = "Delete Comment by Id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Post deleted"),
            @ApiResponse(responseCode = "404", description = "Post with that id not found")
    })
    @DeleteMapping(ID)
    public void deleteComment(@Parameter(description = "Id of comment to be deleted") @PathVariable final Long id) {
        commentRepository.deleteById(id);
    }
}
