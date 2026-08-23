package com.harshit.blog.auth;

import com.harshit.blog.AbstractIntegrationTest;
import com.harshit.blog.auth.entity.RefreshToken;
import com.harshit.blog.auth.repository.RefreshTokenRepository;
import com.harshit.blog.user.entity.User;
import com.harshit.blog.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Transactional
class RefreshTokenRepositoryIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Test
    void shouldPersistRefreshToken() {

        User user = new User(
                "tokenuser",
                "tokenuser@example.com",
                "hashed-password"
        );

        userRepository.saveAndFlush(user);

        String tokenHash =
                "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

        Instant expiresAt =
                Instant.now().plus(7, ChronoUnit.DAYS);

        RefreshToken token =
                new RefreshToken(
                        user,
                        tokenHash,
                        expiresAt
                );

        RefreshToken saved =
                refreshTokenRepository.saveAndFlush(token);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getUser().getId())
                .isEqualTo(user.getId());
        assertThat(saved.getTokenHash())
                .isEqualTo(tokenHash);
        assertThat(saved.getExpiresAt())
                .isEqualTo(expiresAt);
        assertThat(saved.getRevokedAt())
                .isNull();
        assertThat(saved.isRevoked())
                .isFalse();
        assertThat(saved.isExpired())
                .isFalse();
    }

    @Test
    void shouldFindActiveTokenByHash() {

        User user = new User(
                "lookupuser",
                "lookupuser@example.com",
                "hashed-password"
        );

        userRepository.saveAndFlush(user);

        String tokenHash =
                "abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789";

        RefreshToken token =
                new RefreshToken(
                        user,
                        tokenHash,
                        Instant.now().plus(7, ChronoUnit.DAYS)
                );

        refreshTokenRepository.saveAndFlush(token);

        Optional<RefreshToken> found =
                refreshTokenRepository
                        .findByTokenHashAndRevokedAtIsNull(
                                tokenHash
                        );

        assertThat(found).isPresent();
        assertThat(found.get().getId())
                .isEqualTo(token.getId());
    }

    @Test
    void shouldRevokeRefreshToken() {

        User user = new User(
                "revokeuser",
                "revokeuser@example.com",
                "hashed-password"
        );

        userRepository.saveAndFlush(user);

        RefreshToken token =
                new RefreshToken(
                        user,
                        "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
                        Instant.now().plus(7, ChronoUnit.DAYS)
                );

        refreshTokenRepository.saveAndFlush(token);

        token.revoke();

        refreshTokenRepository.saveAndFlush(token);

        assertThat(token.isRevoked()).isTrue();
        assertThat(token.getRevokedAt()).isNotNull();

        Optional<RefreshToken> active =
                refreshTokenRepository
                        .findByTokenHashAndRevokedAtIsNull(
                                token.getTokenHash()
                        );

        assertThat(active).isEmpty();
    }

    @Test
    void shouldRejectDuplicateTokenHash() {

        User user = new User(
                "duplicateuser",
                "duplicateuser@example.com",
                "hashed-password"
        );

        userRepository.saveAndFlush(user);

        String tokenHash =
                "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

        RefreshToken first =
                new RefreshToken(
                        user,
                        tokenHash,
                        Instant.now().plus(7, ChronoUnit.DAYS)
                );

        refreshTokenRepository.saveAndFlush(first);

        RefreshToken duplicate =
                new RefreshToken(
                        user,
                        tokenHash,
                        Instant.now().plus(7, ChronoUnit.DAYS)
                );

        assertThatThrownBy(
                () -> refreshTokenRepository.saveAndFlush(duplicate)
        ).isInstanceOf(
                DataIntegrityViolationException.class
        );
    }
}
