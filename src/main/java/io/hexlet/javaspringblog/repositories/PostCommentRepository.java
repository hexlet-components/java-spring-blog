package io.hexlet.javaspringblog.repositories;

import io.hexlet.javaspringblog.models.post.PostComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, Long> {

    List<PostComment> findAllByPostId(Long postId);
}
