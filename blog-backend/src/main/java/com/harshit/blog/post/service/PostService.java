package com.harshit.blog.post.service;

import com.harshit.blog.post.dto.CreatePostRequest;
import com.harshit.blog.post.dto.PostPageResponse;
import com.harshit.blog.post.dto.PostResponse;
import com.harshit.blog.post.dto.UpdatePostRequest;
import com.harshit.blog.post.entity.Post;
import com.harshit.blog.post.entity.PostStatus;
import com.harshit.blog.post.repository.PostRepository;
import com.harshit.blog.user.entity.User;
import com.harshit.blog.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

import com.harshit.blog.post.entity.PostBookmark;
import com.harshit.blog.post.repository.PostBookmarkRepository;
import java.util.Optional;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PostBookmarkRepository postBookmarkRepository;

    public PostService(
            PostRepository postRepository,
            UserRepository userRepository,
            PostBookmarkRepository postBookmarkRepository
    ) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.postBookmarkRepository = postBookmarkRepository;
    }

    @Transactional
    public PostResponse create(
            UUID authorId,
            CreatePostRequest request
    ) {

        if (postRepository.existsBySlugIgnoreCase(
                request.slug()
        )) {
            throw new IllegalArgumentException(
                    "Slug is already in use"
            );
        }

        User author = userRepository.findById(authorId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );

        Post post = new Post(
                author,
                request.title(),
                request.slug(),
                request.excerpt(),
                request.content(),
                request.coverImageUrl()
        );

        Post saved = postRepository.save(post);

        return PostResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public PostPageResponse getPublishedPosts(
            int page,
            int size,
            String tag,
            String query
    ) {
        Pageable pageable = PageRequest.of(page, size);

        String cleanTag = (tag != null && !tag.isBlank()) ? tag.trim() : null;
        String cleanQuery = (query != null && !query.isBlank()) ? query.trim() : null;

        Page<Post> result;
        if (cleanTag == null && cleanQuery == null) {
            result = postRepository.findByStatusOrderByPublishedAtDesc(PostStatus.PUBLISHED, pageable);
        } else {
            result = postRepository.searchPublishedPosts(
                    cleanTag,
                    cleanQuery,
                    PostStatus.PUBLISHED,
                    pageable
            );
        }

        List<PostResponse> posts = result.getContent()
                .stream()
                .map(PostResponse::from)
                .toList();

        return new PostPageResponse(
                posts,
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages()
        );
    }

    @Transactional(readOnly = true)
    public PostPageResponse getPublishedPosts(
            int page,
            int size,
            String tag
    ) {
        return getPublishedPosts(page, size, tag, null);
    }

    @Transactional(readOnly = true)
    public PostResponse getPublishedPost(
            String slug
    ) {

        Post post = postRepository.findBySlugIgnoreCaseAndStatus(
                slug,
                PostStatus.PUBLISHED
        ).orElseThrow(() ->
                new NoSuchElementException(
                        "Post not found"
                )
        );

        return PostResponse.from(post);
    }

    private Post getOwnedPost(
            UUID postId,
            UUID userId
    ) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "Post not found"
                        )
                );

        if (!post.getAuthor().getId().equals(userId)) {
            throw new AccessDeniedException(
                    "You do not own this post"
            );
        }

        return post;
    }

    @Transactional
    public PostResponse update(
            UUID postId,
            UUID userId,
            UpdatePostRequest request
    ) {
        Post post = getOwnedPost(postId, userId);

        if (!post.getSlug().equalsIgnoreCase(request.slug())
                && postRepository.existsBySlugIgnoreCase(request.slug())) {
            throw new IllegalArgumentException(
                    "Slug is already in use"
            );
        }

        post.setTitle(request.title());
        post.setSlug(request.slug());
        post.setExcerpt(request.excerpt());
        post.setContent(request.content());
        post.setCoverImageUrl(request.coverImageUrl());

        return PostResponse.from(post);
    }

    @Transactional
    public void delete(
            UUID postId,
            UUID userId
    ) {
        Post post = getOwnedPost(postId, userId);

        postRepository.delete(post);
    }

    @Transactional
    public PostResponse publish(
            UUID postId,
            UUID userId
    ) {
        Post post = getOwnedPost(postId, userId);

        if (post.getStatus() == PostStatus.PUBLISHED) {
            return PostResponse.from(post);
        }

        post.setStatus(PostStatus.PUBLISHED);
        post.setPublishedAt(Instant.now());

        return PostResponse.from(post);
    }

    @Transactional
    public boolean toggleBookmark(UUID postId, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Post not found"));

        Optional<PostBookmark> existing = postBookmarkRepository.findByUserIdAndPostId(userId, postId);
        if (existing.isPresent()) {
            postBookmarkRepository.delete(existing.get());
            return false;
        } else {
            PostBookmark bookmark = new PostBookmark(user, post);
            postBookmarkRepository.save(bookmark);
            return true;
        }
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getBookmarkedPosts(UUID userId) {
        return postBookmarkRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(b -> PostResponse.from(b.getPost()))
                .toList();
    }

    @Transactional
    public void cleanupTestPosts() {
        postRepository.findAll().stream()
                .filter(p -> "Published".equalsIgnoreCase(p.getTitle()))
                .forEach(postRepository::delete);
    }
}
