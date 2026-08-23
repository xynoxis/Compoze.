package com.harshit.blog.post.dto;

import com.harshit.blog.post.entity.Post;

import java.time.Instant;
import java.util.UUID;

public record PostResponse(
        UUID id,
        UUID authorId,
        String title,
        String slug,
        String excerpt,
        String content,
        String coverImageUrl,
        String status,
        Instant publishedAt,
        Instant createdAt,
        Instant updatedAt
) {

    public static PostResponse from(Post post) {
        return new PostResponse(
                post.getId(),
                post.getAuthor().getId(),
                post.getTitle(),
                post.getSlug(),
                post.getExcerpt(),
                post.getContent(),
                post.getCoverImageUrl(),
                post.getStatus().name(),
                post.getPublishedAt(),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }
}
