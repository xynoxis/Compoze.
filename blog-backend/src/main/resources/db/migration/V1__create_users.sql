-- ============================================================
-- V1: Create users
-- ============================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    username VARCHAR(30) NOT NULL,
    email VARCHAR(254) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    display_name VARCHAR(100),
    bio VARCHAR(500),
    avatar_url VARCHAR(2048),

    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

    email_verified BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_users_username_length
        CHECK (char_length(username) BETWEEN 3 AND 30),

    CONSTRAINT chk_users_username_format
        CHECK (username ~ '^[A-Za-z0-9_]+$'),

    CONSTRAINT chk_users_role
        CHECK (role IN ('USER', 'ADMIN')),

    CONSTRAINT chk_users_status
        CHECK (status IN ('ACTIVE', 'SUSPENDED', 'DEACTIVATED'))
);


-- ============================================================
-- Case-insensitive uniqueness
--
-- The application can preserve the original casing while
-- preventing:
--
--   Harshit
--   harshit
--   HARSHIT
--
-- from becoming separate accounts.
-- ============================================================

CREATE UNIQUE INDEX uq_users_username_lower
    ON users (LOWER(username));

CREATE UNIQUE INDEX uq_users_email_lower
    ON users (LOWER(email));


-- ============================================================
-- Lookup indexes
-- ============================================================

CREATE INDEX idx_users_status
    ON users (status);

CREATE INDEX idx_users_created_at
    ON users (created_at);


-- ============================================================
-- Keep updated_at correct at the database level.
-- ============================================================

CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_users_updated_at();
