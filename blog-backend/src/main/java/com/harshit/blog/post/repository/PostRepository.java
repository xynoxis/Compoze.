package com.harshit.blog.post.repository;

import com.harshit.blog.post.entity.Post;
import com.harshit.blog.post.entity.PostStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID> {

    Optional<Post> findBySlugIgnoreCase(String slug);

    boolean existsBySlugIgnoreCase(String slug);

    Page<Post> findByStatusOrderByPublishedAtDesc(
            PostStatus status,
            Pageable pageable
    );

    Optional<Post> findBySlugIgnoreCaseAndStatus(
            String slug,
            PostStatus status
    );

    @Query("""
        SELECT pt.post FROM PostTag pt
        WHERE (LOWER(pt.tag.slug) = LOWER(CAST(:tag AS string)) OR LOWER(pt.tag.name) = LOWER(CAST(:tag AS string)))
          AND pt.post.status = :status
        ORDER BY pt.post.publishedAt DESC
    """)
    Page<Post> findByTagAndStatus(
            @Param("tag") String tag,
            @Param("status") PostStatus status,
            Pageable pageable
    );

    @Query("""
        SELECT DISTINCT p FROM Post p
        LEFT JOIN PostTag pt ON pt.post = p
        LEFT JOIN pt.tag t
        WHERE p.status = :status
          AND (:tag IS NULL OR LOWER(t.slug) = LOWER(CAST(:tag AS string)) OR LOWER(t.name) = LOWER(CAST(:tag AS string)))
          AND (:query IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%')))
        ORDER BY p.publishedAt DESC
    """)
    Page<Post> searchPublishedPosts(
            @Param("tag") String tag,
            @Param("query") String query,
            @Param("status") PostStatus status,
            Pageable pageable
    );

    Page<Post> findByStatus(
            PostStatus status,
            Pageable pageable
    );

    Page<Post> findByAuthorId(
            UUID authorId,
            Pageable pageable
    );

    Page<Post> findByAuthorIdAndStatus(
            UUID authorId,
            PostStatus status,
            Pageable pageable
    );
}
