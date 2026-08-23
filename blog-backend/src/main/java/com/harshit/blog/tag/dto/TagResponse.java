package com.harshit.blog.tag.dto;

import com.harshit.blog.tag.entity.Tag;

import java.time.Instant;
import java.util.UUID;

public record TagResponse(
        UUID id,
        String name,
        String slug,
        Instant createdAt
) {
    public static TagResponse from(Tag tag) {
        return new TagResponse(
                tag.getId(),
                tag.getName(),
                tag.getSlug(),
                tag.getCreatedAt()
        );
    }
}
