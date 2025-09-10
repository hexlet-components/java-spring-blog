package io.hexlet.blog.repository;

import io.hexlet.blog.model.PostComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, Long>, JpaSpecificationExecutor<PostComment> {
    // Page<Post> findAll(Specification<Post> spec, Pageable pageable);
}
