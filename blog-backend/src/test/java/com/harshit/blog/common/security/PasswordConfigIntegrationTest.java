package com.harshit.blog.common.security;

import com.harshit.blog.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class PasswordConfigIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void shouldHashAndVerifyPassword() {

        String rawPassword = "correct-password";

        String hash = passwordEncoder.encode(rawPassword);

        assertThat(hash).isNotBlank();
        assertThat(hash).isNotEqualTo(rawPassword);

        assertThat(
                passwordEncoder.matches(rawPassword, hash)
        ).isTrue();

        assertThat(
                passwordEncoder.matches("wrong-password", hash)
        ).isFalse();
    }

    @Test
    void shouldGenerateDifferentHashesForSamePassword() {

        String rawPassword = "same-password";

        String firstHash =
                passwordEncoder.encode(rawPassword);

        String secondHash =
                passwordEncoder.encode(rawPassword);

        assertThat(firstHash)
                .isNotEqualTo(secondHash);

        assertThat(
                passwordEncoder.matches(
                        rawPassword,
                        firstHash
                )
        ).isTrue();

        assertThat(
                passwordEncoder.matches(
                        rawPassword,
                        secondHash
                )
        ).isTrue();
    }
}
