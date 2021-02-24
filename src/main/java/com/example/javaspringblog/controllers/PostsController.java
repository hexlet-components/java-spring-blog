package com.example.javaspringblog.controllers;

import com.example.javaspringblog.repositories.PostRepository;
import com.example.javaspringblog.models.Post;

import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/posts")
public class PostsController {

    @Autowired
    private PostRepository postRepository;

    @GetMapping("/")
    public String index(
            Model model,
            @RequestParam(defaultValue = "0") int page) {

        Pageable paging = PageRequest.of(page, 10);
        Page<Post> posts = postRepository.findAll(paging);
        model.addAttribute("posts", posts);
        return "posts/index";
    }

    @GetMapping("/new")
    public String create() {
        return "posts/new";
    }

    @PostMapping("/")
    public String store(Model model, Post post) {
        // model.addAttribute("msg", "Howdy, World");
        // model.addAttribute("title", "Howdy, World");
        postRepository.save(post);
        return "redirect:/posts";
        // return "posts/index";
    }

    @GetMapping("/{id}")
    public String show(Model model, @PathVariable("id") long id) {
        Post post = postRepository.getOne(id);
        model.addAttribute("post", post);
        return "posts/show";
    }

    @DeleteMapping("/{id}")
    public String destroy(Model model, @PathVariable("id") long id) {
        Post post = postRepository.getOne(id);
        postRepository.delete(post);
        return "redirect:/posts";
    }
}

