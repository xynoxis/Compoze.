package com.harshit.blog.post.repository;

import com.harshit.blog.post.entity.PostBookmark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PostBookmarkRepository extends JpaRepository<PostBookmark, UUID> {

    boolean existsByUserIdAndPostId(UUID userId, UUID postId);

    Optional<PostBookmark> findByUserIdAndPostId(UUID userId, UUID postId);

    void deleteByUserIdAndPostId(UUID userId, UUID postId);

    List<PostBookmark> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
