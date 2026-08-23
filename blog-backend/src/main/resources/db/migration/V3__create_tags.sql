-- ============================================================
-- V3: Create tags and post/tag relationship
-- ============================================================


-- ============================================================
-- Tags
-- ============================================================

CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(50) NOT NULL,
    slug VARCHAR(80) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_tags_name_length
        CHECK (char_length(name) BETWEEN 1 AND 50),

    CONSTRAINT chk_tags_slug_length
        CHECK (char_length(slug) BETWEEN 1 AND 80),

    CONSTRAINT chk_tags_slug_format
        CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);


-- ============================================================
-- Case-insensitive uniqueness
-- ============================================================

CREATE UNIQUE INDEX uq_tags_name_lower
    ON tags (LOWER(name));

CREATE UNIQUE INDEX uq_tags_slug_lower
    ON tags (LOWER(slug));


-- ============================================================
-- Post <-> Tag relationship
-- ============================================================

CREATE TABLE post_tags (
    post_id UUID NOT NULL,
    tag_id UUID NOT NULL,

    PRIMARY KEY (post_id, tag_id),

    CONSTRAINT fk_post_tags_post
        FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_post_tags_tag
        FOREIGN KEY (tag_id)
        REFERENCES tags(id)
        ON DELETE CASCADE
);


-- ============================================================
-- Reverse lookup:
-- "Which posts have this tag?"
-- ============================================================

CREATE INDEX idx_post_tags_tag_id
    ON post_tags (tag_id);
