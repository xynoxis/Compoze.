package com.harshit.blog.tag.repository;

import com.harshit.blog.tag.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TagRepository extends JpaRepository<Tag, UUID> {

    Optional<Tag> findBySlugIgnoreCase(String slug);

    Optional<Tag> findByNameIgnoreCase(String name);

    boolean existsBySlugIgnoreCase(String slug);

    boolean existsByNameIgnoreCase(String name);
}
