package com.harshit.blog.like.web;

import com.harshit.blog.like.dto.LikeResponse;
import com.harshit.blog.like.service.PostLikeService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/posts/{postId}/like")
public class PostLikeController {

    private final PostLikeService likeService;

    public PostLikeController(PostLikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping
    public LikeResponse like(
            @PathVariable UUID postId,
            Authentication authentication
    ) {
        UUID userId = (UUID) authentication.getPrincipal();
        return likeService.like(postId, userId);
    }

    @DeleteMapping
    public LikeResponse unlike(
            @PathVariable UUID postId,
            Authentication authentication
    ) {
        UUID userId = (UUID) authentication.getPrincipal();
        return likeService.unlike(postId, userId);
    }

    @GetMapping
    public LikeResponse status(
            @PathVariable UUID postId,
            Authentication authentication
    ) {
        UUID userId = (UUID) authentication.getPrincipal();
        return likeService.getStatus(postId, userId);
    }
}
