package io.hexlet.javaspringblog.repository;

import io.hexlet.javaspringblog.model.PostComment;
import io.hexlet.javaspringblog.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, Long> {

    List<PostComment> findAllByPostId(Long postId);
}
