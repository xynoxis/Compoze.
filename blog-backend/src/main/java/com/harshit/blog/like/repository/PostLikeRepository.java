package com.harshit.blog.like.repository;

import com.harshit.blog.like.entity.PostLike;
import com.harshit.blog.like.entity.PostLikeId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PostLikeRepository
        extends JpaRepository<PostLike, PostLikeId> {

    boolean existsByIdPostIdAndIdUserId(
            UUID postId,
            UUID userId
    );

    long countByIdPostId(UUID postId);

    void deleteByIdPostIdAndIdUserId(
            UUID postId,
            UUID userId
    );
}
