package com.harshit.blog.auth.dto;

import com.harshit.blog.user.entity.User;

import java.util.UUID;

public record UserResponse(
        UUID id,
        String username,
        String email,
        String displayName,
        String avatarUrl,
        boolean emailVerified
) {

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getDisplayName(),
                user.getAvatarUrl(),
                user.isEmailVerified()
        );
    }
}
