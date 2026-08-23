package com.harshit.blog.post;

import com.harshit.blog.AbstractIntegrationTest;
import com.harshit.blog.common.security.JwtService;
import com.harshit.blog.post.dto.CreatePostRequest;
import com.harshit.blog.post.dto.UpdatePostRequest;
import com.harshit.blog.post.entity.Post;
import com.harshit.blog.post.entity.PostStatus;
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

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class PostControllerIntegrationTest extends AbstractIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private JwtService jwtService;

    private final RestTemplate restTemplate = new RestTemplate();

    @Test
    void shouldCreatePostSuccessfullyWithValidJwt() {
        User author = userRepository.saveAndFlush(
                new User("postauthor", "postauthor@example.com", "hash123")
        );
        String token = jwtService.generateAccessToken(author.getId(), author.getUsername());

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        CreatePostRequest request = new CreatePostRequest(
                "Building a Blog Backend in Java",
                "building-a-blog-backend-in-java",
                "How we built this internship project.",
                "This is the actual blog content...",
                "https://example.com/cover.jpg"
        );

        HttpEntity<CreatePostRequest> requestEntity = new HttpEntity<>(request, headers);
        String url = "http://localhost:" + port + "/api/posts";

        ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("title")).isEqualTo("Building a Blog Backend in Java");
        assertThat(response.getBody().get("slug")).isEqualTo("building-a-blog-backend-in-java");
        assertThat(response.getBody().get("status")).isEqualTo("DRAFT");
        assertThat(response.getBody().get("authorId")).isEqualTo(author.getId().toString());

        Optional<Post> postOpt = postRepository.findBySlugIgnoreCase("building-a-blog-backend-in-java");
        assertThat(postOpt).isPresent();
        assertThat(postOpt.get().getAuthor().getId()).isEqualTo(author.getId());
    }

    @Test
    void shouldRejectPostCreationWithoutJwt() {
        CreatePostRequest request = new CreatePostRequest(
                "No Auth Post",
                "no-auth-post",
                "Excerpt",
                "Content",
                null
        );
        String url = "http://localhost:" + port + "/api/posts";

        assertThatThrownBy(() -> restTemplate.postForEntity(url, request, Map.class))
                .isInstanceOf(HttpClientErrorException.Forbidden.class);
    }

    @Test
    void shouldRejectPostCreationWithInvalidPayload() {
        User author = userRepository.saveAndFlush(
                new User("invaliduser", "invaliduser@example.com", "hash123")
        );
        String token = jwtService.generateAccessToken(author.getId(), author.getUsername());

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        CreatePostRequest request = new CreatePostRequest(
                "", // Blank title
                "blank-title-slug",
                "Excerpt",
                "", // Blank content
                null
        );

        HttpEntity<CreatePostRequest> requestEntity = new HttpEntity<>(request, headers);
        String url = "http://localhost:" + port + "/api/posts";

        assertThatThrownBy(() -> restTemplate.postForEntity(url, requestEntity, Map.class))
                .isInstanceOf(HttpClientErrorException.BadRequest.class);
    }

    @Test
    void shouldRejectPostCreationWithDuplicateSlug() {
        User author = userRepository.saveAndFlush(
                new User("sluguser", "sluguser@example.com", "hash123")
        );
        postRepository.saveAndFlush(
                new Post(author, "Existing Post", "duplicate-slug", "Content")
        );

        String token = jwtService.generateAccessToken(author.getId(), author.getUsername());
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        CreatePostRequest request = new CreatePostRequest(
                "Another Post",
                "duplicate-slug",
                "Excerpt",
                "Content",
                null
        );

        HttpEntity<CreatePostRequest> requestEntity = new HttpEntity<>(request, headers);
        String url = "http://localhost:" + port + "/api/posts";

        assertThatThrownBy(() -> restTemplate.postForEntity(url, requestEntity, Map.class))
                .isInstanceOf(HttpClientErrorException.BadRequest.class)
                .satisfies(ex -> {
                    HttpClientErrorException.BadRequest badRequest = (HttpClientErrorException.BadRequest) ex;
                    assertThat(badRequest.getResponseBodyAsString()).contains("Slug is already in use");
                });
    }

    @Test
    void shouldAssociatePostWithAuthenticatedUser() {
        User authorA = userRepository.saveAndFlush(new User("authora", "authora@example.com", "hashA"));
        User authorB = userRepository.saveAndFlush(new User("authorb", "authorb@example.com", "hashB"));

        String tokenA = jwtService.generateAccessToken(authorA.getId(), authorA.getUsername());
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(tokenA);

        CreatePostRequest request = new CreatePostRequest(
                "Author A Post",
                "author-a-post",
                "Excerpt",
                "Content",
                null
        );

        HttpEntity<CreatePostRequest> requestEntity = new HttpEntity<>(request, headers);
        String url = "http://localhost:" + port + "/api/posts";

        ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().get("authorId")).isEqualTo(authorA.getId().toString());
        assertThat(response.getBody().get("authorId")).isNotEqualTo(authorB.getId().toString());
    }

    @Test
    void shouldGetPublishedPostsWithoutAuthAndExcludeDrafts() {
        User author = userRepository.saveAndFlush(new User("readeruser", "reader@example.com", "hash123"));

        Post draftPost = new Post(author, "Draft Post Title", "draft-post-slug", "Draft content");
        postRepository.saveAndFlush(draftPost);

        Post publishedPost = new Post(author, "Published Post Title", "published-post-slug", "Published content");
        publishedPost.setStatus(PostStatus.PUBLISHED);
        publishedPost.setPublishedAt(Instant.now());
        postRepository.saveAndFlush(publishedPost);

        String url = "http://localhost:" + port + "/api/posts";

        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();

        List<Map<String, Object>> posts = (List<Map<String, Object>>) response.getBody().get("posts");
        assertThat(posts).isNotNull();
        assertThat(posts.stream().map(p -> p.get("slug"))).contains("published-post-slug");
        assertThat(posts.stream().map(p -> p.get("slug"))).doesNotContain("draft-post-slug");
    }

    @Test
    void shouldGetPublishedPostBySlug() {
        User author = userRepository.saveAndFlush(new User("slugauthor", "slugauthor@example.com", "hash123"));
        Post publishedPost = new Post(author, "Single Published Post", "single-published-slug", "Content here");
        publishedPost.setStatus(PostStatus.PUBLISHED);
        publishedPost.setPublishedAt(Instant.now());
        postRepository.saveAndFlush(publishedPost);

        String url = "http://localhost:" + port + "/api/posts/single-published-slug";

        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("title")).isEqualTo("Single Published Post");
        assertThat(response.getBody().get("slug")).isEqualTo("single-published-slug");
        assertThat(response.getBody().get("status")).isEqualTo("PUBLISHED");
    }

    @Test
    void shouldReturn404ForDraftPostBySlug() {
        User author = userRepository.saveAndFlush(new User("draftauthor", "draftauthor@example.com", "hash123"));
        Post draftPost = new Post(author, "Draft Only", "draft-only-slug", "Draft content");
        postRepository.saveAndFlush(draftPost);

        String url = "http://localhost:" + port + "/api/posts/draft-only-slug";

        assertThatThrownBy(() -> restTemplate.getForEntity(url, Map.class))
                .isInstanceOf(HttpClientErrorException.NotFound.class);
    }

    @Test
    void shouldReturn404ForNonExistentSlug() {
        String url = "http://localhost:" + port + "/api/posts/non-existent-slug-xyz";

        assertThatThrownBy(() -> restTemplate.getForEntity(url, Map.class))
                .isInstanceOf(HttpClientErrorException.NotFound.class);
    }

    @Test
    void shouldUpdateOwnPostSuccessfully() {
        User author = userRepository.saveAndFlush(new User("updateuser", "updateuser@example.com", "hash123"));
        Post post = postRepository.saveAndFlush(new Post(author, "Original Title", "original-slug", "Original Content"));

        String token = jwtService.generateAccessToken(author.getId(), author.getUsername());
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        UpdatePostRequest updateRequest = new UpdatePostRequest(
                "Updated Title",
                "updated-slug",
                "Updated Excerpt",
                "Updated Content",
                "https://example.com/updated.jpg"
        );
        HttpEntity<UpdatePostRequest> requestEntity = new HttpEntity<>(updateRequest, headers);
        String url = "http://localhost:" + port + "/api/posts/" + post.getId();

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.PUT, requestEntity, Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("title")).isEqualTo("Updated Title");
        assertThat(response.getBody().get("slug")).isEqualTo("updated-slug");
        assertThat(response.getBody().get("excerpt")).isEqualTo("Updated Excerpt");
        assertThat(response.getBody().get("content")).isEqualTo("Updated Content");
    }

    @Test
    void shouldRejectUpdatingPostOwnedByAnotherUser() {
        User owner = userRepository.saveAndFlush(new User("owneruser", "owner@example.com", "hash123"));
        User otherUser = userRepository.saveAndFlush(new User("otheruser", "other@example.com", "hash123"));
        Post post = postRepository.saveAndFlush(new Post(owner, "Owner Title", "owner-slug", "Owner Content"));

        String otherToken = jwtService.generateAccessToken(otherUser.getId(), otherUser.getUsername());
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(otherToken);

        UpdatePostRequest updateRequest = new UpdatePostRequest(
                "Hacked Title",
                "hacked-slug",
                "Excerpt",
                "Hacked Content",
                null
        );
        HttpEntity<UpdatePostRequest> requestEntity = new HttpEntity<>(updateRequest, headers);
        String url = "http://localhost:" + port + "/api/posts/" + post.getId();

        assertThatThrownBy(() -> restTemplate.exchange(url, HttpMethod.PUT, requestEntity, Map.class))
                .isInstanceOf(HttpClientErrorException.Forbidden.class);
    }

    @Test
    void shouldPublishOwnPostSuccessfullyAndMakeItVisiblePublicly() {
        User author = userRepository.saveAndFlush(new User("publisher", "publisher@example.com", "hash123"));
        Post post = postRepository.saveAndFlush(new Post(author, "Draft to Publish", "draft-to-publish-slug", "Content"));

        String token = jwtService.generateAccessToken(author.getId(), author.getUsername());
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        String publishUrl = "http://localhost:" + port + "/api/posts/" + post.getId() + "/publish";

        ResponseEntity<Map> response = restTemplate.postForEntity(publishUrl, requestEntity, Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("status")).isEqualTo("PUBLISHED");
        assertThat(response.getBody().get("publishedAt")).isNotNull();

        // Verify post is now returned in public GET /api/posts
        String feedUrl = "http://localhost:" + port + "/api/posts";
        ResponseEntity<Map> feedResponse = restTemplate.getForEntity(feedUrl, Map.class);
        List<Map<String, Object>> posts = (List<Map<String, Object>>) feedResponse.getBody().get("posts");
        assertThat(posts.stream().map(p -> p.get("slug"))).contains("draft-to-publish-slug");
    }

    @Test
    void shouldDeleteOwnPostSuccessfully() {
        User author = userRepository.saveAndFlush(new User("deleteruser", "deleter@example.com", "hash123"));
        Post post = postRepository.saveAndFlush(new Post(author, "To Delete", "to-delete-slug", "Content"));

        String token = jwtService.generateAccessToken(author.getId(), author.getUsername());
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        String url = "http://localhost:" + port + "/api/posts/" + post.getId();

        ResponseEntity<Void> response = restTemplate.exchange(url, HttpMethod.DELETE, requestEntity, Void.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        assertThat(postRepository.findById(post.getId())).isEmpty();
    }

    @Test
    void shouldRejectDeletingPostOwnedByAnotherUser() {
        User owner = userRepository.saveAndFlush(new User("deleteowner", "deleteowner@example.com", "hash123"));
        User attacker = userRepository.saveAndFlush(new User("attackeruser", "attacker@example.com", "hash123"));
        Post post = postRepository.saveAndFlush(new Post(owner, "Protected Post", "protected-slug", "Content"));

        String attackerToken = jwtService.generateAccessToken(attacker.getId(), attacker.getUsername());
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(attackerToken);
        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        String url = "http://localhost:" + port + "/api/posts/" + post.getId();

        assertThatThrownBy(() -> restTemplate.exchange(url, HttpMethod.DELETE, requestEntity, Void.class))
                .isInstanceOf(HttpClientErrorException.Forbidden.class);
    }
}
