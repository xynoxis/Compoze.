package com.harshit.blog.auth.repository;

import com.harshit.blog.auth.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository
        extends JpaRepository<RefreshToken, UUID> {

    Optional<RefreshToken> findByTokenHash(String tokenHash);

    Optional<RefreshToken> findByTokenHashAndRevokedAtIsNull(
            String tokenHash
    );

    List<RefreshToken> findByUserIdAndRevokedAtIsNull(
            UUID userId
    );

    long deleteByExpiresAtBefore(Instant cutoff);

    long deleteByUserId(UUID userId);
}
