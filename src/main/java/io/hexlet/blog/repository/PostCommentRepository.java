package io.hexlet.blog.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import io.hexlet.blog.model.Post;
import io.hexlet.blog.model.PostComment;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, Long>, JpaSpecificationExecutor<PostComment> {
    // Page<Post> findAll(Specification<Post> spec, Pageable pageable);

    Optional<List<PostComment>> findAllByPostId(Long postId);
}

