-- ============================================================
-- V5: Create post likes
-- ============================================================

CREATE TABLE post_likes (
    post_id UUID NOT NULL,
    user_id UUID NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_post_likes
        PRIMARY KEY (post_id, user_id),

    CONSTRAINT fk_post_likes_post
        FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_post_likes_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
);


-- ============================================================
-- User -> liked posts lookup
--
-- The primary key already provides efficient lookup by
-- post_id, but user_id needs its own index for:
--
--   "Which posts has this user liked?"
-- ============================================================

CREATE INDEX idx_post_likes_user_id
    ON post_likes (user_id);


-- ============================================================
-- Created-at index
--
-- Useful later for analytics/activity queries.
-- ============================================================

CREATE INDEX idx_post_likes_created_at
    ON post_likes (created_at);
