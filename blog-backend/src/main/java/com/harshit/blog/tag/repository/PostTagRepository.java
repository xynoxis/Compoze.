package com.harshit.blog.tag.repository;

import com.harshit.blog.tag.entity.PostTag;
import com.harshit.blog.tag.entity.PostTagId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PostTagRepository
        extends JpaRepository<PostTag, PostTagId> {

    List<PostTag> findByIdPostId(UUID postId);

    List<PostTag> findByIdTagId(UUID tagId);

    boolean existsByIdPostIdAndIdTagId(
            UUID postId,
            UUID tagId
    );

    void deleteByIdPostIdAndIdTagId(
            UUID postId,
            UUID tagId
    );
}
