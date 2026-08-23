package com.harshit.blog.post.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreatePostRequest(

        @NotBlank
        @Size(max = 200)
        String title,

        @NotBlank
        @Size(max = 220)
        String slug,

        @Size(max = 500)
        String excerpt,

        @NotBlank
        String content,

        @Size(max = 2048)
        String coverImageUrl

) {
}
