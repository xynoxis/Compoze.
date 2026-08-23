package com.harshit.blog.tag.web;

import com.harshit.blog.tag.dto.TagRequest;
import com.harshit.blog.tag.dto.TagResponse;
import com.harshit.blog.tag.service.TagService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping("/api/tags")
    public List<TagResponse> getAllTags() {
        return tagService.getAllTags();
    }

    @PostMapping("/api/posts/{postId}/tags")
    @ResponseStatus(HttpStatus.CREATED)
    public TagResponse attachTag(
            @PathVariable UUID postId,
            @Valid @RequestBody TagRequest request,
            Authentication authentication
    ) {
        UUID userId = (UUID) authentication.getPrincipal();
        return tagService.attachTagToPost(postId, userId, request);
    }

    @DeleteMapping("/api/posts/{postId}/tags/{tagId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeTag(
            @PathVariable UUID postId,
            @PathVariable UUID tagId,
            Authentication authentication
    ) {
        UUID userId = (UUID) authentication.getPrincipal();
        tagService.removeTagFromPost(postId, tagId, userId);
    }
}
