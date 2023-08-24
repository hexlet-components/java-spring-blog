package io.hexlet.blog.controller.api;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;

import io.hexlet.blog.dto.PostDTO;
import io.hexlet.blog.exception.ResourceNotFoundException;
import io.hexlet.blog.model.Post;
import io.hexlet.blog.repository.PostRepository;
import io.hexlet.blog.util.UserUtils;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class PostsController {
    @Autowired
    private final PostRepository repository;

    @Autowired
    private ModelMapper mm;

    @Autowired
    private UserUtils userUtils;

    @GetMapping("/posts")
    ResponseEntity<List<PostDTO>> index() {
        var posts = repository.findAll();
        var result = posts.stream()
                .map((post) -> mm.map(post, PostDTO.class))
                .collect(Collectors.toList());

        return ResponseEntity.ok()
                .header("X-Total-Count", String.valueOf(posts.size()))
                .body(result);
    }

    @PostMapping("/posts")
    PostDTO create(@RequestBody PostDTO postData) throws JsonProcessingException {
        var post = new Post();
        post.setName(postData.getName());
        post.setSlug(postData.getSlug());
        post.setBody(postData.getBody());
        post.setAuthor(userUtils.getCurrentUser());
        repository.save(post);
        var postDTO = mm.map(post, PostDTO.class);
        return postDTO;
    }

    @GetMapping("/posts/{id}")
    PostDTO show(@PathVariable Long id) {
        var post = repository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Not Found: " + id));
        var postDTO = mm.map(post, PostDTO.class);
        return postDTO;
    }

    @PutMapping("/posts/{id}")
    void update(@RequestBody Post newPost, @PathVariable Long id) {
        var post = repository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Not Found"));
        post.setName(newPost.getName());
        post.setBody(newPost.getBody());
    }

    @DeleteMapping("/posts/{id}")
    void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
