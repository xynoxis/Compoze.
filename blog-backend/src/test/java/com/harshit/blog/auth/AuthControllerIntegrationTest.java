package com.harshit.blog.auth;

import com.harshit.blog.AbstractIntegrationTest;
import com.harshit.blog.auth.dto.LoginRequest;
import com.harshit.blog.auth.dto.RefreshRequest;
import com.harshit.blog.auth.dto.RegisterRequest;
import com.harshit.blog.auth.entity.RefreshToken;
import com.harshit.blog.auth.repository.RefreshTokenRepository;
import com.harshit.blog.common.security.JwtService;
import com.harshit.blog.common.security.RefreshTokenService;
import com.harshit.blog.user.entity.User;
import com.harshit.blog.user.entity.UserStatus;
import com.harshit.blog.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AuthControllerIntegrationTest extends AbstractIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    private final RestTemplate restTemplate = new RestTemplate();

    @Test
    void shouldRegisterUserSuccessfully() {
        String url = "http://localhost:" + port + "/api/auth/register";

        RegisterRequest request = new RegisterRequest(
                "registeruser",
                "registeruser@example.com",
                "mySecurePassword123",
                "Register User"
        );

        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("username")).isEqualTo("registeruser");
        assertThat(response.getBody().get("email")).isEqualTo("registeruser@example.com");
        assertThat(response.getBody().get("displayName")).isEqualTo("Register User");
        assertThat(response.getBody()).doesNotContainKey("passwordHash");

        Optional<User> userOptional = userRepository.findByUsernameIgnoreCase("registeruser");
        assertThat(userOptional).isPresent();
        User user = userOptional.get();
        assertThat(user.getPasswordHash()).isNotEqualTo("mySecurePassword123");
        assertThat(passwordEncoder.matches("mySecurePassword123", user.getPasswordHash())).isTrue();
    }

    @Test
    void shouldRejectDuplicateUsername() {
        String url = "http://localhost:" + port + "/api/auth/register";

        User existingUser = new User(
                "dupuser",
                "dupuser1@example.com",
                "hashedpassword"
        );
        userRepository.saveAndFlush(existingUser);

        RegisterRequest request = new RegisterRequest(
                "dupuser",
                "dupuser2@example.com",
                "mySecurePassword123",
                "Dup User"
        );

        assertThatThrownBy(() -> restTemplate.postForEntity(url, request, Map.class))
                .isInstanceOf(HttpClientErrorException.BadRequest.class)
                .satisfies(ex -> {
                    HttpClientErrorException.BadRequest badRequest = (HttpClientErrorException.BadRequest) ex;
                    assertThat(badRequest.getResponseBodyAsString()).contains("Username is already in use");
                });
    }

    @Test
    void shouldRejectDuplicateEmail() {
        String url = "http://localhost:" + port + "/api/auth/register";

        User existingUser = new User(
                "dupemailuser1",
                "sameemail@example.com",
                "hashedpassword"
        );
        userRepository.saveAndFlush(existingUser);

        RegisterRequest request = new RegisterRequest(
                "dupemailuser2",
                "sameemail@example.com",
                "mySecurePassword123",
                "Dup Email User"
        );

        assertThatThrownBy(() -> restTemplate.postForEntity(url, request, Map.class))
                .isInstanceOf(HttpClientErrorException.BadRequest.class)
                .satisfies(ex -> {
                    HttpClientErrorException.BadRequest badRequest = (HttpClientErrorException.BadRequest) ex;
                    assertThat(badRequest.getResponseBodyAsString()).contains("Email is already in use");
                });
    }

    @Test
    void shouldRejectInvalidRegistrationRequest() {
        String url = "http://localhost:" + port + "/api/auth/register";

        RegisterRequest request = new RegisterRequest(
                "ab", // Too short (min = 3)
                "invalid-email",
                "123", // Too short (min = 8)
                "Test"
        );

        assertThatThrownBy(() -> restTemplate.postForEntity(url, request, Map.class))
                .isInstanceOf(HttpClientErrorException.BadRequest.class);
    }

    @Test
    void shouldLoginSuccessfullyAndReturnBothAccessAndRefreshToken() {
        String registerUrl = "http://localhost:" + port + "/api/auth/register";
        RegisterRequest registerRequest = new RegisterRequest(
                "loginuser",
                "loginuser@example.com",
                "loginPassword123",
                "Login User"
        );
        restTemplate.postForEntity(registerUrl, registerRequest, Map.class);

        String loginUrl = "http://localhost:" + port + "/api/auth/login";
        LoginRequest loginRequest = new LoginRequest(
                "loginuser@example.com",
                "loginPassword123"
        );

        ResponseEntity<Map> response = restTemplate.postForEntity(loginUrl, loginRequest, Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("tokenType")).isEqualTo("Bearer");
        assertThat(response.getBody().get("expiresIn")).isEqualTo(900);

        String accessToken = (String) response.getBody().get("accessToken");
        String refreshToken = (String) response.getBody().get("refreshToken");

        assertThat(accessToken).isNotBlank();
        assertThat(refreshToken).isNotBlank();

        assertThat(jwtService.extractUsername(accessToken)).isEqualTo("loginuser");
        assertThat(jwtService.isValid(accessToken)).isTrue();

        // Verify SHA-256 hash in DB matches raw refreshToken hash, but raw token is not stored plain
        String hash = refreshTokenService.hash(refreshToken);
        Optional<RefreshToken> storedTokenOpt = refreshTokenRepository.findByTokenHash(hash);
        assertThat(storedTokenOpt).isPresent();
        assertThat(storedTokenOpt.get().getTokenHash()).isNotEqualTo(refreshToken);
    }

    @Test
    void shouldRejectLoginWithWrongPassword() {
        String registerUrl = "http://localhost:" + port + "/api/auth/register";
        RegisterRequest registerRequest = new RegisterRequest(
                "wrongpassuser",
                "wrongpassuser@example.com",
                "correctPassword123",
                "Wrong Pass User"
        );
        restTemplate.postForEntity(registerUrl, registerRequest, Map.class);

        String loginUrl = "http://localhost:" + port + "/api/auth/login";
        LoginRequest loginRequest = new LoginRequest(
                "wrongpassuser@example.com",
                "incorrectPassword123"
        );

        assertThatThrownBy(() -> restTemplate.postForEntity(loginUrl, loginRequest, Map.class))
                .isInstanceOf(HttpClientErrorException.BadRequest.class)
                .satisfies(ex -> {
                    HttpClientErrorException.BadRequest badRequest = (HttpClientErrorException.BadRequest) ex;
                    assertThat(badRequest.getResponseBodyAsString()).contains("Invalid email or password");
                });
    }

    @Test
    void shouldRejectLoginWithUnknownEmail() {
        String loginUrl = "http://localhost:" + port + "/api/auth/login";
        LoginRequest loginRequest = new LoginRequest(
                "nonexistent@example.com",
                "anyPassword123"
        );

        assertThatThrownBy(() -> restTemplate.postForEntity(loginUrl, loginRequest, Map.class))
                .isInstanceOf(HttpClientErrorException.BadRequest.class)
                .satisfies(ex -> {
                    HttpClientErrorException.BadRequest badRequest = (HttpClientErrorException.BadRequest) ex;
                    assertThat(badRequest.getResponseBodyAsString()).contains("Invalid email or password");
                });
    }

    @Test
    void shouldRejectInvalidLoginPayload() {
        String loginUrl = "http://localhost:" + port + "/api/auth/login";
        LoginRequest loginRequest = new LoginRequest(
                "not-an-email",
                ""
        );

        assertThatThrownBy(() -> restTemplate.postForEntity(loginUrl, loginRequest, Map.class))
                .isInstanceOf(HttpClientErrorException.BadRequest.class);
    }

    @Test
    void shouldRejectLoginForInactiveUser() {
        String hash = passwordEncoder.encode("password123");
        User user = new User(
                "suspendeduser",
                "suspended@example.com",
                hash,
                "Suspended User"
        );
        user.setStatus(UserStatus.SUSPENDED);
        userRepository.saveAndFlush(user);

        String loginUrl = "http://localhost:" + port + "/api/auth/login";
        LoginRequest loginRequest = new LoginRequest(
                "suspended@example.com",
                "password123"
        );

        assertThatThrownBy(() -> restTemplate.postForEntity(loginUrl, loginRequest, Map.class))
                .isInstanceOf(HttpClientErrorException.BadRequest.class)
                .satisfies(ex -> {
                    HttpClientErrorException.BadRequest badRequest = (HttpClientErrorException.BadRequest) ex;
                    assertThat(badRequest.getResponseBodyAsString()).contains("User account is not active");
                });
    }

    @Test
    void shouldRefreshTokensAndRotateRefreshToken() {
        String registerUrl = "http://localhost:" + port + "/api/auth/register";
        RegisterRequest registerRequest = new RegisterRequest(
                "refreshuser",
                "refreshuser@example.com",
                "refreshPassword123",
                "Refresh User"
        );
        restTemplate.postForEntity(registerUrl, registerRequest, Map.class);

        String loginUrl = "http://localhost:" + port + "/api/auth/login";
        LoginRequest loginRequest = new LoginRequest(
                "refreshuser@example.com",
                "refreshPassword123"
        );
        ResponseEntity<Map> loginResponse = restTemplate.postForEntity(loginUrl, loginRequest, Map.class);

        String oldRefreshToken = (String) loginResponse.getBody().get("refreshToken");
        String oldRefreshTokenHash = refreshTokenService.hash(oldRefreshToken);

        String refreshUrl = "http://localhost:" + port + "/api/auth/refresh";
        RefreshRequest refreshRequest = new RefreshRequest(oldRefreshToken);

        ResponseEntity<Map> refreshResponse = restTemplate.postForEntity(refreshUrl, refreshRequest, Map.class);

        assertThat(refreshResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(refreshResponse.getBody()).isNotNull();

        String newAccessToken = (String) refreshResponse.getBody().get("accessToken");
        String newRefreshToken = (String) refreshResponse.getBody().get("refreshToken");

        assertThat(newAccessToken).isNotBlank();
        assertThat(newRefreshToken).isNotBlank();
        assertThat(newRefreshToken).isNotEqualTo(oldRefreshToken);

        // Verify old refresh token is revoked in DB
        Optional<RefreshToken> oldTokenOpt = refreshTokenRepository.findByTokenHash(oldRefreshTokenHash);
        assertThat(oldTokenOpt).isPresent();
        assertThat(oldTokenOpt.get().isRevoked()).isTrue();

        // Verify new refresh token exists in DB and is active
        String newRefreshTokenHash = refreshTokenService.hash(newRefreshToken);
        Optional<RefreshToken> newTokenOpt = refreshTokenRepository.findByTokenHash(newRefreshTokenHash);
        assertThat(newTokenOpt).isPresent();
        assertThat(newTokenOpt.get().isRevoked()).isFalse();
    }

    @Test
    void shouldRejectRevokedRefreshToken() {
        String registerUrl = "http://localhost:" + port + "/api/auth/register";
        RegisterRequest registerRequest = new RegisterRequest(
                "revokeduser",
                "revokeduser@example.com",
                "revokedPassword123",
                "Revoked User"
        );
        restTemplate.postForEntity(registerUrl, registerRequest, Map.class);

        String loginUrl = "http://localhost:" + port + "/api/auth/login";
        LoginRequest loginRequest = new LoginRequest(
                "revokeduser@example.com",
                "revokedPassword123"
        );
        ResponseEntity<Map> loginResponse = restTemplate.postForEntity(loginUrl, loginRequest, Map.class);

        String oldRefreshToken = (String) loginResponse.getBody().get("refreshToken");

        String refreshUrl = "http://localhost:" + port + "/api/auth/refresh";
        RefreshRequest refreshRequest = new RefreshRequest(oldRefreshToken);

        // First refresh succeeds and revokes oldRefreshToken
        restTemplate.postForEntity(refreshUrl, refreshRequest, Map.class);

        // Second refresh using the old revoked token must be rejected
        assertThatThrownBy(() -> restTemplate.postForEntity(refreshUrl, refreshRequest, Map.class))
                .isInstanceOf(HttpClientErrorException.BadRequest.class)
                .satisfies(ex -> {
                    HttpClientErrorException.BadRequest badRequest = (HttpClientErrorException.BadRequest) ex;
                    assertThat(badRequest.getResponseBodyAsString()).contains("Invalid refresh token");
                });
    }

    @Test
    void shouldRejectExpiredRefreshToken() {
        User user = new User("expireduser", "expired@example.com", passwordEncoder.encode("password123"));
        userRepository.saveAndFlush(user);

        String rawToken = "expired-raw-refresh-token-123456789";
        String tokenHash = refreshTokenService.hash(rawToken);
        RefreshToken expiredToken = new RefreshToken(user, tokenHash, Instant.now().minusSeconds(3600));
        expiredToken.setCreatedAt(Instant.now().minusSeconds(7200));
        refreshTokenRepository.saveAndFlush(expiredToken);

        String refreshUrl = "http://localhost:" + port + "/api/auth/refresh";
        RefreshRequest refreshRequest = new RefreshRequest(rawToken);

        assertThatThrownBy(() -> restTemplate.postForEntity(refreshUrl, refreshRequest, Map.class))
                .isInstanceOf(HttpClientErrorException.BadRequest.class)
                .satisfies(ex -> {
                    HttpClientErrorException.BadRequest badRequest = (HttpClientErrorException.BadRequest) ex;
                    assertThat(badRequest.getResponseBodyAsString()).contains("Invalid refresh token");
                });
    }

    @Test
    void shouldRejectInvalidRefreshToken() {
        String refreshUrl = "http://localhost:" + port + "/api/auth/refresh";
        RefreshRequest refreshRequest = new RefreshRequest("invalid-unknown-refresh-token");

        assertThatThrownBy(() -> restTemplate.postForEntity(refreshUrl, refreshRequest, Map.class))
                .isInstanceOf(HttpClientErrorException.BadRequest.class)
                .satisfies(ex -> {
                    HttpClientErrorException.BadRequest badRequest = (HttpClientErrorException.BadRequest) ex;
                    assertThat(badRequest.getResponseBodyAsString()).contains("Invalid refresh token");
                });
    }
}
