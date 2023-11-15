package io.hexlet.blog.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import io.hexlet.blog.service.PostService;
import io.hexlet.blog.dto.PostCreateDTO;
import io.hexlet.blog.dto.PostDTO;
import io.hexlet.blog.dto.PostUpdateDTO;
import io.hexlet.blog.exception.ResourceNotFoundException;
import io.hexlet.blog.mapper.PostMapper;
import io.hexlet.blog.repository.PostRepository;
import io.hexlet.blog.util.UserUtils;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class PostsController {

    private static final String ONLY_AUTHOR = """
                @postRepository.findById(#id).get().getAuthor().getEmail() == authentication.getName()
            """;

    @Autowired
    private PostRepository repository;

    @Autowired
    private PostMapper postMapper;

    @Autowired
    private UserUtils userUtils;

    @Autowired
    private PostService postService;

    @GetMapping("/posts")
    @ResponseStatus(HttpStatus.OK)
    ResponseEntity<List<PostDTO>> index() {
        var posts = postService.getAll();

        return ResponseEntity.ok()
                .header("X-Total-Count", String.valueOf(posts.size()))
                .body(posts);
    }

    @PostMapping("/posts")
    @ResponseStatus(HttpStatus.CREATED)
    PostDTO create(@Valid @RequestBody PostCreateDTO postData) {
        var post = postMapper.map(postData);
        post.setAuthor(userUtils.getCurrentUser());
        repository.save(post);
        var postDTO = postMapper.map(post);
        return postDTO;
    }

    @GetMapping("/posts/{id}")
    @ResponseStatus(HttpStatus.OK)
    PostDTO show(@PathVariable Long id) {
        var post = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Not Found: " + id));
        var postDTO = postMapper.map(post);
        return postDTO;
    }

    @PutMapping("/posts/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize(ONLY_AUTHOR)
    PostDTO update(@RequestBody @Valid PostUpdateDTO postData, @PathVariable Long id) {
        var post = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Not Found"));
        postMapper.update(postData, post);
        repository.save(post);
        var postDTO = postMapper.map(post);
        return postDTO;
    }

    @DeleteMapping("/posts/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize(ONLY_AUTHOR)
    void destroy(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
