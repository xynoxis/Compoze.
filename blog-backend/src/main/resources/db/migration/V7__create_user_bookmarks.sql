-- ============================================================
-- V7: Create user bookmarks
-- ============================================================

CREATE TABLE user_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,
    post_id UUID NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_user_bookmarks_user_post
        UNIQUE (user_id, post_id),

    CONSTRAINT fk_user_bookmarks_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user_bookmarks_post
        FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE CASCADE
);


-- ============================================================
-- User -> bookmarked posts lookup
-- ============================================================

CREATE INDEX idx_user_bookmarks_user_id
    ON user_bookmarks (user_id);


-- ============================================================
-- Post lookup
-- ============================================================

CREATE INDEX idx_user_bookmarks_post_id
    ON user_bookmarks (post_id);


-- ============================================================
-- Created-at index
-- ============================================================

CREATE INDEX idx_user_bookmarks_created_at
    ON user_bookmarks (created_at);
