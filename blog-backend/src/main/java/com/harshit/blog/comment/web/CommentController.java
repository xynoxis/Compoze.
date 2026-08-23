package com.harshit.blog.comment.web;

import com.harshit.blog.comment.dto.CommentResponse;
import com.harshit.blog.comment.dto.CreateCommentRequest;
import com.harshit.blog.comment.service.CommentService;
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
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/api/posts/{postId}/comments")
    public List<CommentResponse> getComments(
            @PathVariable UUID postId
    ) {
        return commentService.getComments(postId);
    }

    @PostMapping("/api/posts/{postId}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    public CommentResponse create(
            @PathVariable UUID postId,
            @Valid @RequestBody CreateCommentRequest request,
            Authentication authentication
    ) {
        UUID userId = (UUID) authentication.getPrincipal();
        return commentService.create(postId, userId, request);
    }

    @PostMapping("/api/comments/{commentId}/replies")
    @ResponseStatus(HttpStatus.CREATED)
    public CommentResponse reply(
            @PathVariable UUID commentId,
            @Valid @RequestBody CreateCommentRequest request,
            Authentication authentication
    ) {
        UUID userId = (UUID) authentication.getPrincipal();
        return commentService.reply(commentId, userId, request);
    }

    @DeleteMapping("/api/comments/{commentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable UUID commentId,
            Authentication authentication
    ) {
        UUID userId = (UUID) authentication.getPrincipal();
        commentService.delete(commentId, userId);
    }
}
