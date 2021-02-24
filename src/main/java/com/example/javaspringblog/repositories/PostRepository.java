package com.example.javaspringblog.repositories;

import com.example.javaspringblog.models.Post;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}
