package com.harshit.blog.like.service;

import com.harshit.blog.like.dto.LikeResponse;
import com.harshit.blog.like.entity.PostLike;
import com.harshit.blog.like.repository.PostLikeRepository;
import com.harshit.blog.post.entity.Post;
import com.harshit.blog.post.repository.PostRepository;
import com.harshit.blog.user.entity.User;
import com.harshit.blog.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class PostLikeService {

    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostLikeService(
            PostLikeRepository postLikeRepository,
            PostRepository postRepository,
            UserRepository userRepository
    ) {
        this.postLikeRepository = postLikeRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public LikeResponse like(
            UUID postId,
            UUID userId
    ) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Post not found"));

        if (!postLikeRepository.existsByIdPostIdAndIdUserId(postId, userId)) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new NoSuchElementException("User not found"));

            PostLike like = new PostLike(post, user);
            postLikeRepository.save(like);
        }

        return getStatus(postId, userId);
    }

    @Transactional
    public LikeResponse unlike(
            UUID postId,
            UUID userId
    ) {
        if (!postRepository.existsById(postId)) {
            throw new NoSuchElementException("Post not found");
        }

        postLikeRepository.deleteByIdPostIdAndIdUserId(postId, userId);

        return getStatus(postId, userId);
    }

    @Transactional(readOnly = true)
    public LikeResponse getStatus(
            UUID postId,
            UUID userId
    ) {
        if (!postRepository.existsById(postId)) {
            throw new NoSuchElementException("Post not found");
        }

        long count = postLikeRepository.countByIdPostId(postId);
        boolean liked = postLikeRepository.existsByIdPostIdAndIdUserId(postId, userId);

        return new LikeResponse(liked, count);
    }
}
