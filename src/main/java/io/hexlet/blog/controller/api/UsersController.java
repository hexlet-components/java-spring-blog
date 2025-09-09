package io.hexlet.blog.controller.api;

import io.hexlet.blog.dto.UserCreateDTO;
import io.hexlet.blog.dto.UserDTO;
import io.hexlet.blog.dto.UserUpdateDTO;
import io.hexlet.blog.exception.ResourceNotFoundException;
import io.hexlet.blog.mapper.UserMapper;
import io.hexlet.blog.repository.UserRepository;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UsersController {
    @Autowired
    private UserRepository repository;

    @Autowired
    private UserMapper userMapper;

    @PostMapping("/users")
    @ResponseStatus(HttpStatus.CREATED)
    UserDTO create(@Valid @RequestBody UserCreateDTO userData) {
        var user = userMapper.map(userData);
        repository.save(user);
        return userMapper.map(user);
    }

    @GetMapping("/users")
    ResponseEntity<List<UserDTO>> index() {
        var users = repository.findAll();
        var result = users.stream().map(userMapper::map).toList();
        return ResponseEntity.ok().header("X-Total-Count", String.valueOf(users.size())).body(result);
    }

    @GetMapping("/users/{id}")
    @ResponseStatus(HttpStatus.OK)
    UserDTO show(@PathVariable Long id) {
        var user = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not Found"));
        return userMapper.map(user);
    }

    @PutMapping("/users/{id}")
    @ResponseStatus(HttpStatus.OK)
    UserDTO update(@RequestBody UserUpdateDTO userData, @PathVariable Long id) {
        var user = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not Found"));
        userMapper.update(userData, user);
        repository.save(user);
        var userDTO = userMapper.map(user);
        return userDTO;
    }
}
