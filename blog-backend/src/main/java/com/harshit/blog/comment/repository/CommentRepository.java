package com.harshit.blog.comment.repository;

import com.harshit.blog.comment.entity.Comment;
import com.harshit.blog.comment.entity.CommentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CommentRepository
        extends JpaRepository<Comment, UUID> {

    List<Comment> findByPostIdAndStatusOrderByCreatedAtAsc(
            UUID postId,
            CommentStatus status
    );

    Page<Comment> findByPostIdAndParentIsNullAndStatus(
            UUID postId,
            CommentStatus status,
            Pageable pageable
    );

    List<Comment> findByParentIdAndStatusOrderByCreatedAtAsc(
            UUID parentId,
            CommentStatus status
    );

    Page<Comment> findByPostIdAndStatus(
            UUID postId,
            CommentStatus status,
            Pageable pageable
    );

    Page<Comment> findByAuthorId(
            UUID authorId,
            Pageable pageable
    );
}
