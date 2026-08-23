package com.harshit.blog.like.dto;

public record LikeResponse(
        boolean liked,
        long count
) {
}
