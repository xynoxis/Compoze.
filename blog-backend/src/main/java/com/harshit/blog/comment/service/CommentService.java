package com.harshit.blog.comment.service;

import com.harshit.blog.comment.dto.CommentResponse;
import com.harshit.blog.comment.dto.CreateCommentRequest;
import com.harshit.blog.comment.entity.Comment;
import com.harshit.blog.comment.entity.CommentStatus;
import com.harshit.blog.comment.repository.CommentRepository;
import com.harshit.blog.post.entity.Post;
import com.harshit.blog.post.repository.PostRepository;
import com.harshit.blog.user.entity.User;
import com.harshit.blog.user.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public CommentService(
            CommentRepository commentRepository,
            PostRepository postRepository,
            UserRepository userRepository
    ) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public CommentResponse create(
            UUID postId,
            UUID authorId,
            CreateCommentRequest request
    ) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Post not found"));

        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        Comment comment = new Comment(
                post,
                author,
                null,
                request.content()
        );

        return toResponse(commentRepository.save(comment));
    }

    @Transactional
    public CommentResponse reply(
            UUID parentId,
            UUID authorId,
            CreateCommentRequest request
    ) {
        Comment parent = commentRepository.findById(parentId)
                .orElseThrow(() -> new NoSuchElementException("Comment not found"));

        if (parent.getParent() != null) {
            throw new IllegalArgumentException("Replies cannot have replies");
        }

        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        Comment comment = new Comment(
                parent.getPost(),
                author,
                parent,
                request.content()
        );

        return toResponse(commentRepository.save(comment));
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getComments(UUID postId) {
        List<Comment> comments = commentRepository.findByPostIdAndStatusOrderByCreatedAtAsc(
                postId,
                CommentStatus.ACTIVE
        );

        return comments.stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void delete(UUID commentId, UUID userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new NoSuchElementException("Comment not found"));

        if (!comment.getAuthor().getId().equals(userId)) {
            throw new AccessDeniedException("You do not own this comment");
        }

        comment.setStatus(CommentStatus.DELETED);
    }

    private CommentResponse toResponse(Comment comment) {
        return new CommentResponse(
                comment.getId(),
                comment.getPost().getId(),
                comment.getAuthor().getId(),
                comment.getAuthor().getUsername(),
                comment.getParent() == null ? null : comment.getParent().getId(),
                comment.getContent(),
                comment.getStatus().name(),
                comment.getCreatedAt(),
                comment.getUpdatedAt()
        );
    }
}
