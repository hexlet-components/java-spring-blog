package io.hexlet.javaspringblog.repositories;

import io.hexlet.javaspringblog.models.post.Post;
import io.hexlet.javaspringblog.models.post.PostStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findPostsByPostStatusNot(PostStatus postStatus);
}
