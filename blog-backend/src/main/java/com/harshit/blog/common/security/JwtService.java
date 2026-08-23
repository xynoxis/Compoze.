package com.harshit.blog.common.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {

    private final JwtProperties properties;
    private final SecretKey signingKey;

    public JwtService(JwtProperties properties) {
        this.properties = properties;

        this.signingKey = Keys.hmacShaKeyFor(
                properties.getSecret()
                        .getBytes(StandardCharsets.UTF_8)
        );
    }

    public String generateAccessToken(
            UUID userId,
            String username
    ) {
        Instant now = Instant.now();

        Instant expiration = now.plusMillis(
                properties.getAccessTokenExpiration()
        );

        return Jwts.builder()
                .subject(userId.toString())
                .claim("username", username)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiration))
                .signWith(signingKey)
                .compact();
    }

    public UUID extractUserId(String token) {

        Claims claims = parseClaims(token);

        return UUID.fromString(
                claims.getSubject()
        );
    }

    public String extractUsername(String token) {

        Claims claims = parseClaims(token);

        return claims.get("username", String.class);
    }

    public boolean isValid(String token) {

        try {
            parseClaims(token);
            return true;
        } catch (Exception exception) {
            return false;
        }
    }

    public long getAccessTokenExpirationSeconds() {
        return properties.getAccessTokenExpiration() / 1000;
    }

    private Claims parseClaims(String token) {

        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
