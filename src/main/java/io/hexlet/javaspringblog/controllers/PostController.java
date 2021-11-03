package io.hexlet.javaspringblog.controllers;

import io.hexlet.javaspringblog.models.post.Post;
import io.hexlet.javaspringblog.repositories.PostRepository;
import java.util.List;
import javax.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import static io.hexlet.javaspringblog.controllers.PostController.POST_CONTROLLER_PATH;
import static org.springframework.http.HttpStatus.CREATED;

@RestController
@RequestMapping(POST_CONTROLLER_PATH)
public class PostController {

    public static final String POST_CONTROLLER_PATH = "/posts";
    public static final String ID = "{id}";

    private final PostRepository postRepository;

    public PostController(final PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @GetMapping
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    @GetMapping(ID)
    public Post getPostById(@PathVariable final Long id) {
        return postRepository.findById(id).get();
    }

    @PostMapping
    @ResponseStatus(CREATED)
    public Post createPost(@Valid @RequestBody final Post post) {
        return postRepository.save(post);
    }

    @PutMapping
    public Post updatePost(@Valid @RequestBody final Post post) {
        return postRepository.save(post);
    }

    @DeleteMapping(ID)
    public void deletePost(@PathVariable final Long id) {
        postRepository.deleteById(id);
    }
}
