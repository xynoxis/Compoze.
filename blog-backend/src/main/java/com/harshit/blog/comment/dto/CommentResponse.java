package com.harshit.blog.comment.dto;

import java.time.Instant;
import java.util.UUID;

public record CommentResponse(
        UUID id,
        UUID postId,
        UUID authorId,
        String authorUsername,
        UUID parentId,
        String content,
        String status,
        Instant createdAt,
        Instant updatedAt
) {
}
