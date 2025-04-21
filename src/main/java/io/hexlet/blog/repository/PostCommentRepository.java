package io.hexlet.blog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import io.hexlet.blog.model.PostComment;

@Repository
public interface PostCommentRepository
    extends JpaRepository<PostComment, Long>, JpaSpecificationExecutor<PostComment> { }

