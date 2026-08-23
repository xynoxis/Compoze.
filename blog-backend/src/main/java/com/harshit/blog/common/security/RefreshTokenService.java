package com.harshit.blog.common.security;

import com.harshit.blog.auth.entity.RefreshToken;
import com.harshit.blog.auth.repository.RefreshTokenRepository;
import com.harshit.blog.user.entity.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;

@Service
public class RefreshTokenService {

    private static final int TOKEN_BYTES = 32;
    private static final long REFRESH_TOKEN_DAYS = 7;

    private final RefreshTokenRepository refreshTokenRepository;
    private final SecureRandom secureRandom;

    public RefreshTokenService(
            RefreshTokenRepository refreshTokenRepository
    ) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.secureRandom = new SecureRandom();
    }

    @Transactional
    public String create(User user) {

        byte[] randomBytes = new byte[TOKEN_BYTES];
        secureRandom.nextBytes(randomBytes);

        String rawToken = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);

        String tokenHash = hash(rawToken);

        Instant expiresAt = Instant.now().plus(REFRESH_TOKEN_DAYS, ChronoUnit.DAYS);

        RefreshToken refreshToken = new RefreshToken(user, tokenHash, expiresAt);

        refreshTokenRepository.save(refreshToken);

        return rawToken;
    }

    public String hash(String value) {

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    value.getBytes(StandardCharsets.UTF_8)
            );

            StringBuilder result = new StringBuilder();

            for (byte b : hash) {
                result.append(String.format("%02x", b));
            }

            return result.toString();

        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException(
                    "SHA-256 is not available",
                    exception
            );
        }
    }
}
