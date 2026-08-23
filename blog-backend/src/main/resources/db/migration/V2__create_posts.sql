-- ============================================================
-- V2: Create posts
-- ============================================================

CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    author_id UUID NOT NULL,

    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL,

    excerpt VARCHAR(500),
    content TEXT NOT NULL,

    cover_image_url VARCHAR(2048),

    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',

    published_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_posts_author
        FOREIGN KEY (author_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_posts_title_length
        CHECK (char_length(title) BETWEEN 1 AND 200),

    CONSTRAINT chk_posts_slug_length
        CHECK (char_length(slug) BETWEEN 1 AND 220),

    CONSTRAINT chk_posts_slug_format
        CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),

    CONSTRAINT chk_posts_status
        CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),

    CONSTRAINT chk_posts_published_at
        CHECK (
            status <> 'PUBLISHED'
            OR published_at IS NOT NULL
        )
);


-- ============================================================
-- Slugs are case-insensitively unique.
--
-- Example:
--
-- "my-first-post"
-- "My-First-Post"
--
-- cannot coexist.
-- ============================================================

CREATE UNIQUE INDEX uq_posts_slug_lower
    ON posts (LOWER(slug));


-- ============================================================
-- Author lookup
--
-- Used for:
--   /users/{username}/posts
--   author's dashboard
--   author's post history
-- ============================================================

CREATE INDEX idx_posts_author_id
    ON posts (author_id);


-- ============================================================
-- Status lookup
-- ============================================================

CREATE INDEX idx_posts_status
    ON posts (status);


-- ============================================================
-- Published post feed.
--
-- Partial index keeps drafts and archived posts out of the
-- homepage/feed index.
-- ============================================================

CREATE INDEX idx_posts_published_feed
    ON posts (published_at DESC)
    WHERE status = 'PUBLISHED';


-- ============================================================
-- Author + published posts.
--
-- Useful for public author pages.
-- ============================================================

CREATE INDEX idx_posts_author_published
    ON posts (author_id, published_at DESC)
    WHERE status = 'PUBLISHED';


-- ============================================================
-- updated_at trigger
-- ============================================================

CREATE OR REPLACE FUNCTION update_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION update_posts_updated_at();
