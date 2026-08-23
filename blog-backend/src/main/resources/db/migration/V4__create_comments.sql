-- ============================================================
-- V4: Create comments
-- ============================================================

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    post_id UUID NOT NULL,
    author_id UUID NOT NULL,
    parent_id UUID,

    content TEXT NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_comments_post
        FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_comments_author
        FOREIGN KEY (author_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_comments_parent
        FOREIGN KEY (parent_id)
        REFERENCES comments(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_comments_content_length
        CHECK (char_length(content) BETWEEN 1 AND 5000),

    CONSTRAINT chk_comments_status
        CHECK (status IN ('ACTIVE', 'DELETED', 'HIDDEN'))
);


-- ============================================================
-- Post comments
--
-- Used for:
--   loading comments for a post
--   counting comments
--   moderation
-- ============================================================

CREATE INDEX idx_comments_post_id
    ON comments (post_id);


-- ============================================================
-- Author comments
--
-- Useful for:
--   user activity
--   moderation
--   account management
-- ============================================================

CREATE INDEX idx_comments_author_id
    ON comments (author_id);


-- ============================================================
-- Parent lookup
--
-- Used to retrieve replies to a comment.
-- ============================================================

CREATE INDEX idx_comments_parent_id
    ON comments (parent_id);


-- ============================================================
-- Efficient retrieval of active comments.
--
-- Deleted/hidden comments remain in the database but don't
-- need to participate in normal public comment queries.
-- ============================================================

CREATE INDEX idx_comments_post_active
    ON comments (post_id, created_at ASC)
    WHERE status = 'ACTIVE';


-- ============================================================
-- updated_at trigger
-- ============================================================

CREATE OR REPLACE FUNCTION update_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_comments_updated_at
BEFORE UPDATE ON comments
FOR EACH ROW
EXECUTE FUNCTION update_comments_updated_at();
