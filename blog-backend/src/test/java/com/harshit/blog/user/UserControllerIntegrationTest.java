package com.harshit.blog.user;

import com.harshit.blog.AbstractIntegrationTest;
import com.harshit.blog.common.security.JwtService;
import com.harshit.blog.user.entity.User;
import com.harshit.blog.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserControllerIntegrationTest extends AbstractIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final RestTemplate restTemplate = new RestTemplate();

    @Test
    void shouldReturnCurrentUserProfileWhenAuthenticated() {
        User user = new User("meuser", "me@example.com", passwordEncoder.encode("password123"), "Me User");
        User savedUser = userRepository.saveAndFlush(user);

        String token = jwtService.generateAccessToken(savedUser.getId(), savedUser.getUsername());

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        String url = "http://localhost:" + port + "/api/users/me";
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, requestEntity, Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("id")).isEqualTo(savedUser.getId().toString());
        assertThat(response.getBody().get("username")).isEqualTo("meuser");
        assertThat(response.getBody().get("email")).isEqualTo("me@example.com");
        assertThat(response.getBody().get("displayName")).isEqualTo("Me User");
        assertThat(response.getBody()).doesNotContainKey("passwordHash");
    }

    @Test
    void shouldRejectUnauthenticatedRequestToMeEndpoint() {
        String url = "http://localhost:" + port + "/api/users/me";

        assertThatThrownBy(() -> restTemplate.getForEntity(url, Map.class))
                .isInstanceOf(HttpClientErrorException.Forbidden.class);
    }

    @Test
    void shouldRejectRequestWithInvalidToken() {
        String url = "http://localhost:" + port + "/api/users/me";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth("invalid-jwt-token-garbage");
        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        assertThatThrownBy(() -> restTemplate.exchange(url, HttpMethod.GET, requestEntity, Map.class))
                .isInstanceOf(HttpClientErrorException.Forbidden.class);
    }

    @Test
    void shouldReturnCorrectUserForUserSpecificToken() {
        User userA = userRepository.saveAndFlush(new User("usera", "usera@example.com", "hashA", "User A"));
        User userB = userRepository.saveAndFlush(new User("userb", "userb@example.com", "hashB", "User B"));

        String tokenA = jwtService.generateAccessToken(userA.getId(), userA.getUsername());

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(tokenA);
        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        String url = "http://localhost:" + port + "/api/users/me";
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, requestEntity, Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("id")).isEqualTo(userA.getId().toString());
        assertThat(response.getBody().get("username")).isEqualTo("usera");
        assertThat(response.getBody().get("username")).isNotEqualTo(userB.getUsername());
    }
}
