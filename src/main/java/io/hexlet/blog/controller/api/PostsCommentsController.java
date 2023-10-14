package io.hexlet.blog.controller.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import io.hexlet.blog.dto.PostCommentParamsDTO;
import io.hexlet.blog.model.PostComment;
import io.hexlet.blog.repository.PostCommentRepository;
import io.hexlet.blog.specification.PostCommentSpecification;

@RestController
@RequestMapping("/api")
public class PostsCommentsController {
    @Autowired
    private PostCommentRepository repository;

    @Autowired
    private PostCommentSpecification specBuilder;

    @GetMapping("/posts_comments")
    @ResponseStatus(HttpStatus.OK)
    Page<PostComment> index(PostCommentParamsDTO params, @RequestParam(defaultValue = "1") int page) {
        var spec = specBuilder.build(params);
        var comments = repository.findAll(spec, PageRequest.of(page - 1, 10));

        return comments;
    }
}

