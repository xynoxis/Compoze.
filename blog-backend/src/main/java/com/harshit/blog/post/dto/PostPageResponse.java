package com.harshit.blog.post.dto;

import java.util.List;

public record PostPageResponse(
        List<PostResponse> posts,
        int page,
        int size,
        long totalElements,
        int totalPages
) {
}
