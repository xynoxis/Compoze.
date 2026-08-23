-- ============================================================
-- V6: Create refresh tokens
-- ============================================================

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    token_hash VARCHAR(64) NOT NULL,

    expires_at TIMESTAMPTZ NOT NULL,

    revoked_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_refresh_tokens_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_refresh_tokens_token_hash
        UNIQUE (token_hash),

    CONSTRAINT chk_refresh_tokens_expiry
        CHECK (expires_at > created_at),

    CONSTRAINT chk_refresh_tokens_revocation
        CHECK (
            revoked_at IS NULL
            OR revoked_at >= created_at
        )
);


-- ============================================================
-- User lookup
--
-- Used when:
--   - logging out all sessions
--   - revoking user sessions
--   - refreshing tokens
-- ============================================================

CREATE INDEX idx_refresh_tokens_user_id
    ON refresh_tokens (user_id);


-- ============================================================
-- Expiration lookup
--
-- Useful later for cleanup of expired tokens.
-- ============================================================

CREATE INDEX idx_refresh_tokens_expires_at
    ON refresh_tokens (expires_at);


-- ============================================================
-- Active-token lookup
--
-- Keeps revoked tokens out of the index.
-- ============================================================

CREATE INDEX idx_refresh_tokens_active
    ON refresh_tokens (user_id, expires_at)
    WHERE revoked_at IS NULL;
