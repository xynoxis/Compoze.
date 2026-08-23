package com.harshit.blog.like.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
public class PostLikeId implements Serializable {

    @Column(name = "post_id", nullable = false)
    private UUID postId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    protected PostLikeId() {
        // Required by JPA.
    }

    public PostLikeId(UUID postId, UUID userId) {
        this.postId = postId;
        this.userId = userId;
    }

    public UUID getPostId() {
        return postId;
    }

    public UUID getUserId() {
        return userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }

        if (!(o instanceof PostLikeId other)) {
            return false;
        }

        return postId.equals(other.postId)
                && userId.equals(other.userId);
    }

    @Override
    public int hashCode() {
        int result = postId.hashCode();
        result = 31 * result + userId.hashCode();
        return result;
    }
}
