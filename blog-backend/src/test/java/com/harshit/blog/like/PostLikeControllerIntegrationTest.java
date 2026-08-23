package com.harshit.blog.like;

import com.harshit.blog.AbstractIntegrationTest;
import com.harshit.blog.common.security.JwtService;
import com.harshit.blog.like.repository.PostLikeRepository;
import com.harshit.blog.post.entity.Post;
import com.harshit.blog.post.repository.PostRepository;
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
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class PostLikeControllerIntegrationTest extends AbstractIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostLikeRepository postLikeRepository;

    @Autowired
    private JwtService jwtService;

    private final RestTemplate restTemplate = new RestTemplate();

    @Test
    void shouldLikePostSuccessfully() {
        User user = userRepository.saveAndFlush(new User("liker1", "liker1@example.com", "hash123"));
        Post post = postRepository.saveAndFlush(new Post(user, "Liked Post 1", "liked-post-1", "Content"));

        String token = jwtService.generateAccessToken(user.getId(), user.getUsername());
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        String url = "http://localhost:" + port + "/api/posts/" + post.getId() + "/like";

        ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("liked")).isEqualTo(true);
        assertThat(response.getBody().get("count")).isEqualTo(1);
    }

    @Test
    void shouldGetLikeStatus() {
        User user = userRepository.saveAndFlush(new User("likerstatus", "likerstatus@example.com", "hash123"));
        Post post = postRepository.saveAndFlush(new Post(user, "Status Post", "status-post", "Content"));

        String token = jwtService.generateAccessToken(user.getId(), user.getUsername());
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        String likeUrl = "http://localhost:" + port + "/api/posts/" + post.getId() + "/like";
        restTemplate.postForEntity(likeUrl, requestEntity, Map.class);

        ResponseEntity<Map> response = restTemplate.exchange(likeUrl, HttpMethod.GET, requestEntity, Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("liked")).isEqualTo(true);
        assertThat(response.getBody().get("count")).isEqualTo(1);
    }

    @Test
    void shouldBeIdempotentOnDuplicateLike() {
        User user = userRepository.saveAndFlush(new User("dupliker", "dupliker@example.com", "hash123"));
        Post post = postRepository.saveAndFlush(new Post(user, "Dup Like Post", "dup-like-post", "Content"));

        String token = jwtService.generateAccessToken(user.getId(), user.getUsername());
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        String url = "http://localhost:" + port + "/api/posts/" + post.getId() + "/like";

        // First like
        restTemplate.postForEntity(url, requestEntity, Map.class);

        // Second like attempt
        ResponseEntity<Map> response2 = restTemplate.postForEntity(url, requestEntity, Map.class);

        assertThat(response2.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response2.getBody()).isNotNull();
        assertThat(response2.getBody().get("liked")).isEqualTo(true);
        assertThat(response2.getBody().get("count")).isEqualTo(1);
    }

    @Test
    void shouldUnlikePostSuccessfully() {
        User user = userRepository.saveAndFlush(new User("unliker", "unliker@example.com", "hash123"));
        Post post = postRepository.saveAndFlush(new Post(user, "Unlike Post", "unlike-post", "Content"));

        String token = jwtService.generateAccessToken(user.getId(), user.getUsername());
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        String url = "http://localhost:" + port + "/api/posts/" + post.getId() + "/like";

        // Like first
        restTemplate.postForEntity(url, requestEntity, Map.class);

        // Unlike
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.DELETE, requestEntity, Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("liked")).isEqualTo(false);
        assertThat(response.getBody().get("count")).isEqualTo(0);
    }

    @Test
    void shouldRejectUnauthenticatedLikeRequest() {
        User user = userRepository.saveAndFlush(new User("noauthliker", "noauthliker@example.com", "hash123"));
        Post post = postRepository.saveAndFlush(new Post(user, "No Auth Like Post", "no-auth-like-post", "Content"));

        String url = "http://localhost:" + port + "/api/posts/" + post.getId() + "/like";

        assertThatThrownBy(() -> restTemplate.postForEntity(url, null, Map.class))
                .isInstanceOf(HttpClientErrorException.Forbidden.class);
    }

    @Test
    void shouldIncrementCountForMultipleUsers() {
        User user1 = userRepository.saveAndFlush(new User("multiliker1", "multiliker1@example.com", "hash123"));
        User user2 = userRepository.saveAndFlush(new User("multiliker2", "multiliker2@example.com", "hash123"));
        Post post = postRepository.saveAndFlush(new Post(user1, "Multi Like Post", "multi-like-post", "Content"));

        String token1 = jwtService.generateAccessToken(user1.getId(), user1.getUsername());
        HttpHeaders headers1 = new HttpHeaders();
        headers1.setBearerAuth(token1);
        HttpEntity<Void> requestEntity1 = new HttpEntity<>(headers1);

        String token2 = jwtService.generateAccessToken(user2.getId(), user2.getUsername());
        HttpHeaders headers2 = new HttpHeaders();
        headers2.setBearerAuth(token2);
        HttpEntity<Void> requestEntity2 = new HttpEntity<>(headers2);

        String url = "http://localhost:" + port + "/api/posts/" + post.getId() + "/like";

        restTemplate.postForEntity(url, requestEntity1, Map.class);
        ResponseEntity<Map> response2 = restTemplate.postForEntity(url, requestEntity2, Map.class);

        assertThat(response2.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response2.getBody()).isNotNull();
        assertThat(response2.getBody().get("liked")).isEqualTo(true);
        assertThat(response2.getBody().get("count")).isEqualTo(2);
    }
}
