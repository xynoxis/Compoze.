package com.harshit.blog.auth.dto;

public record LoginResponse(
        String accessToken,
        String tokenType,
        long expiresIn
) {
}
