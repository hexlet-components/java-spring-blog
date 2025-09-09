package io.hexlet.blog.service;

import io.hexlet.blog.dto.PostCreateDTO;
import io.hexlet.blog.dto.PostDTO;
import io.hexlet.blog.dto.PostUpdateDTO;
import io.hexlet.blog.exception.ResourceNotFoundException;
import io.hexlet.blog.mapper.PostMapper;
import io.hexlet.blog.repository.PostRepository;
import io.hexlet.blog.util.UserUtils;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PostService {
    @Autowired
    private PostRepository repository;

    @Autowired
    private PostMapper postMapper;

    @Autowired
    private UserUtils userUtils;

    PostDTO create(PostCreateDTO postData) {
        var post = postMapper.map(postData);
        post.setAuthor(userUtils.getCurrentUser());
        repository.save(post);
        var postDTO = postMapper.map(post);
        return postDTO;
    }

    void delete(Long id) {
        repository.deleteById(id);
    }

    PostDTO findById(Long id) {
        var post = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not Found: " + id));
        var postDTO = postMapper.map(post);
        return postDTO;
    }

    public List<PostDTO> getAll() {
        var posts = repository.findAll();
        var result = posts.stream().map(postMapper::map).toList();
        return result;
    }

    PostDTO update(PostUpdateDTO postData, Long id) {
        var post = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not Found"));
        postMapper.update(postData, post);
        repository.save(post);
        var postDTO = postMapper.map(post);
        return postDTO;
    }
}
