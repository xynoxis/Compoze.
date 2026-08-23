package com.harshit.blog.tag.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
public class PostTagId implements Serializable {

    @Column(name = "post_id", nullable = false)
    private UUID postId;

    @Column(name = "tag_id", nullable = false)
    private UUID tagId;

    protected PostTagId() {
        // Required by JPA.
    }

    public PostTagId(UUID postId, UUID tagId) {
        this.postId = postId;
        this.tagId = tagId;
    }

    public UUID getPostId() {
        return postId;
    }

    public UUID getTagId() {
        return tagId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }

        if (!(o instanceof PostTagId other)) {
            return false;
        }

        return postId.equals(other.postId)
                && tagId.equals(other.tagId);
    }

    @Override
    public int hashCode() {
        int result = postId.hashCode();
        result = 31 * result + tagId.hashCode();
        return result;
    }
}
