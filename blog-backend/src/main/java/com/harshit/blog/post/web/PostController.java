package com.harshit.blog.post.web;

import com.harshit.blog.post.dto.CreatePostRequest;
import com.harshit.blog.post.dto.PostPageResponse;
import com.harshit.blog.post.dto.PostResponse;
import com.harshit.blog.post.dto.UpdatePostRequest;
import com.harshit.blog.post.service.PostService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PostResponse create(
            @Valid @RequestBody CreatePostRequest request,
            Authentication authentication
    ) {

        UUID userId = (UUID) authentication.getPrincipal();

        return postService.create(userId, request);
    }

    @GetMapping
    public PostPageResponse getPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String query
    ) {
        int clampedSize = Math.min(Math.max(size, 1), 50);
        return postService.getPublishedPosts(page, clampedSize, tag, query);
    }

    @GetMapping("/admin-cleanup-test-posts")
    public java.util.Map<String, String> cleanupTestPosts() {
        postService.cleanupTestPosts();
        return java.util.Map.of("message", "Cleaned up old test posts");
    }

    @GetMapping("/{slug}")
    public PostResponse getPost(
            @PathVariable String slug
    ) {
        return postService.getPublishedPost(slug);
    }

    @PutMapping("/{id}")
    public PostResponse update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdatePostRequest request,
            Authentication authentication
    ) {
        UUID userId = (UUID) authentication.getPrincipal();

        return postService.update(
                id,
                userId,
                request
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable UUID id,
            Authentication authentication
    ) {
        UUID userId = (UUID) authentication.getPrincipal();

        postService.delete(
                id,
                userId
        );
    }

    @PostMapping("/{id}/publish")
    public PostResponse publish(
            @PathVariable UUID id,
            Authentication authentication
    ) {
        UUID userId = (UUID) authentication.getPrincipal();

        return postService.publish(
                id,
                userId
        );
    }

    @PostMapping("/{id}/bookmark")
    public java.util.Map<String, Boolean> toggleBookmark(
            @PathVariable UUID id,
            Authentication authentication
    ) {
        UUID userId = (UUID) authentication.getPrincipal();
        boolean bookmarked = postService.toggleBookmark(id, userId);
        return java.util.Map.of("bookmarked", bookmarked);
    }

    @GetMapping("/bookmarks/me")
    public List<PostResponse> getMyBookmarks(
            Authentication authentication
    ) {
        UUID userId = (UUID) authentication.getPrincipal();
        return postService.getBookmarkedPosts(userId);
    }

    @GetMapping("/public-cleanup")
    public java.util.Map<String, String> publicCleanupTestPosts() {
        postService.cleanupTestPosts();
        return java.util.Map.of("message", "Cleaned up old test posts");
    }
}
