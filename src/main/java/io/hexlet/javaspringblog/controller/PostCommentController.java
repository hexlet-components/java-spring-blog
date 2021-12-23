package io.hexlet.javaspringblog.controllers;

import io.hexlet.javaspringblog.model.PostComment;
import io.hexlet.javaspringblog.dto.PostCommentDto;
import io.hexlet.javaspringblog.repository.PostCommentRepository;
import io.hexlet.javaspringblog.service.PostCommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.util.List;
import javax.validation.Valid;
import lombok.AllArgsConstructor;
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

@AllArgsConstructor
@RestController
@RequestMapping("${base-url}" + COMMENT_CONTROLLER_PATH)
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
    private final PostCommentService postCommentService;

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
            final PostCommentDto commentDto) {
        return postCommentService.createNewPostComment(commentDto);
    }

    @Operation(summary = "Update Existing Comment")
    @ApiResponse(responseCode = "200", description = "Comment updated")
    @PutMapping(ID)
    @PreAuthorize(ONLY_COMMENT_OWNER_BY_DTO)
    public PostComment updateComment(
            @Parameter(description = "Post comment id")
            @PathVariable final Long id,
            @Parameter(description = "Comment to update")
            @Valid
            @RequestBody
            final PostCommentDto dto) {
        return postCommentService.updatePostComment(id, dto);
    }

    @Operation(summary = "Delete Comment by Id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Post deleted"),
            @ApiResponse(responseCode = "404", description = "Post with that id not found")
    })
    @DeleteMapping(ID)
    @PreAuthorize(ONLY_COMMENT_OWNER_BY_ID)
    public void deleteComment(@Parameter(description = "Id of comment to be deleted") @PathVariable final Long id) {
        commentRepository.deleteById(id);
    }
}
