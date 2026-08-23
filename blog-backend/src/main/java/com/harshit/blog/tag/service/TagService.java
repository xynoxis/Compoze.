package com.harshit.blog.tag.service;

import com.harshit.blog.post.entity.Post;
import com.harshit.blog.post.repository.PostRepository;
import com.harshit.blog.tag.dto.TagRequest;
import com.harshit.blog.tag.dto.TagResponse;
import com.harshit.blog.tag.entity.PostTag;
import com.harshit.blog.tag.entity.Tag;
import com.harshit.blog.tag.repository.PostTagRepository;
import com.harshit.blog.tag.repository.TagRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class TagService {

    private final TagRepository tagRepository;
    private final PostTagRepository postTagRepository;
    private final PostRepository postRepository;

    public TagService(
            TagRepository tagRepository,
            PostTagRepository postTagRepository,
            PostRepository postRepository
    ) {
        this.tagRepository = tagRepository;
        this.postTagRepository = postTagRepository;
        this.postRepository = postRepository;
    }

    @Transactional(readOnly = true)
    public List<TagResponse> getAllTags() {
        return tagRepository.findAll()
                .stream()
                .map(TagResponse::from)
                .toList();
    }

    @Transactional
    public TagResponse attachTagToPost(
            UUID postId,
            UUID userId,
            TagRequest request
    ) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Post not found"));

        if (!post.getAuthor().getId().equals(userId)) {
            throw new AccessDeniedException("You do not own this post");
        }

        String tagName = request.name().trim();
        String slug = tagName.toLowerCase().replaceAll("\\s+", "-");

        Tag tag = tagRepository.findByNameIgnoreCase(tagName)
                .orElseGet(() -> tagRepository.findBySlugIgnoreCase(slug)
                        .orElseGet(() -> tagRepository.save(new Tag(tagName, slug))));

        if (!postTagRepository.existsByIdPostIdAndIdTagId(postId, tag.getId())) {
            postTagRepository.save(new PostTag(post, tag));
        }

        return TagResponse.from(tag);
    }

    @Transactional
    public void removeTagFromPost(
            UUID postId,
            UUID tagId,
            UUID userId
    ) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Post not found"));

        if (!post.getAuthor().getId().equals(userId)) {
            throw new AccessDeniedException("You do not own this post");
        }

        postTagRepository.deleteByIdPostIdAndIdTagId(postId, tagId);
    }
}
