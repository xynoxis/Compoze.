package com.harshit.blog.user.dto;

import com.harshit.blog.user.entity.User;

import java.time.Instant;
import java.util.UUID;

public record PublicUserProfileResponse(
        UUID id,
        String username,
        String displayName,
        String avatarUrl,
        String bio,
        Instant createdAt
) {
    public static PublicUserProfileResponse from(User user) {
        return new PublicUserProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getDisplayName(),
                user.getAvatarUrl(),
                user.getBio(),
                user.getCreatedAt()
        );
    }
}
