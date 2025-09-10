package io.hexlet.blog.controller.api;

import io.hexlet.blog.dto.PostCommentDTO;
import io.hexlet.blog.dto.PostCommentParamsDTO;
import io.hexlet.blog.mapper.PostCommentMapper;
import io.hexlet.blog.repository.PostCommentRepository;
import io.hexlet.blog.specification.PostCommentSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PostsCommentsController {
    @Autowired
    private PostCommentRepository repository;

    @Autowired
    private PostCommentSpecification specBuilder;

    @Autowired
    private PostCommentMapper postCommentMapper;

    @GetMapping("/posts_comments")
    @ResponseStatus(HttpStatus.OK)
    Page<PostCommentDTO> index(PostCommentParamsDTO params, @RequestParam(defaultValue = "1") int page) {
        var spec = specBuilder.build(params);
        var comments = repository.findAll(spec, PageRequest.of(page - 1, 10));
        var result = comments.map(postCommentMapper::map);

        return result;
    }
}
