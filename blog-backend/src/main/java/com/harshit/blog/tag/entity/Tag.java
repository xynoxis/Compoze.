package com.harshit.blog.tag.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "tags")
public class Tag {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, length = 80)
    private String slug;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected Tag() {
        // Required by JPA.
    }

    public Tag(String name, String slug) {
        this.name = name;
        this.slug = slug;
    }

    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = UUID.randomUUID();
        }

        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
