package com.harshit.blog.common.security;

import com.harshit.blog.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class JwtServiceIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private JwtService jwtService;

    @Test
    void shouldGenerateAndReadAccessToken() {

        UUID userId = UUID.randomUUID();
        String username = "harshit";

        String token =
                jwtService.generateAccessToken(
                        userId,
                        username
                );

        assertThat(token).isNotBlank();

        assertThat(
                jwtService.extractUserId(token)
        ).isEqualTo(userId);

        assertThat(
                jwtService.extractUsername(token)
        ).isEqualTo(username);

        assertThat(
                jwtService.isValid(token)
        ).isTrue();
    }

    @Test
    void shouldRejectTamperedToken() {

        UUID userId = UUID.randomUUID();

        String token =
                jwtService.generateAccessToken(
                        userId,
                        "harshit"
                );

        String tamperedToken =
                token.substring(0, token.length() - 2)
                        + "xx";

        assertThat(
                jwtService.isValid(tamperedToken)
        ).isFalse();
    }

    @Test
    void shouldRejectMalformedToken() {

        assertThat(
                jwtService.isValid("not-a-jwt")
        ).isFalse();
    }
}
