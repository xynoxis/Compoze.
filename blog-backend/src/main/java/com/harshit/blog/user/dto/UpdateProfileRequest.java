package com.harshit.blog.user.dto;

import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @Size(max = 100, message = "Display name cannot exceed 100 characters")
        String displayName,

        @Size(max = 500, message = "Bio cannot exceed 500 characters")
        String bio,

        @Size(max = 2048, message = "Avatar URL cannot exceed 2048 characters")
        String avatarUrl
) {
}
