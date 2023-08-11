package io.hexlet.blog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import io.hexlet.blog.model.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

}
