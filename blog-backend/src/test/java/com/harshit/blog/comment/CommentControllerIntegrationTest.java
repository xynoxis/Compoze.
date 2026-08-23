package com.harshit.blog.comment;

import com.harshit.blog.AbstractIntegrationTest;
import com.harshit.blog.comment.dto.CreateCommentRequest;
import com.harshit.blog.comment.entity.Comment;
import com.harshit.blog.comment.entity.CommentStatus;
import com.harshit.blog.comment.repository.CommentRepository;
import com.harshit.blog.common.security.JwtService;
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

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class CommentControllerIntegrationTest extends AbstractIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private JwtService jwtService;

    private final RestTemplate restTemplate = new RestTemplate();

    @Test
    void shouldCreateTopLevelCommentSuccessfully() {
        User author = userRepository.saveAndFlush(new User("commenter", "commenter@example.com", "hash123"));
        Post post = postRepository.saveAndFlush(new Post(author, "Commented Post", "commented-post", "Content"));

        String token = jwtService.generateAccessToken(author.getId(), author.getUsername());
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        CreateCommentRequest request = new CreateCommentRequest("Awesome blog post!");
        HttpEntity<CreateCommentRequest> requestEntity = new HttpEntity<>(request, headers);

        String url = "http://localhost:" + port + "/api/posts/" + post.getId() + "/comments";

        ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("postId")).isEqualTo(post.getId().toString());
        assertThat(response.getBody().get("authorId")).isEqualTo(author.getId().toString());
        assertThat(response.getBody().get("authorUsername")).isEqualTo("commenter");
        assertThat(response.getBody().get("parentId")).isNull();
        assertThat(response.getBody().get("content")).isEqualTo("Awesome blog post!");
        assertThat(response.getBody().get("status")).isEqualTo("ACTIVE");
    }

    @Test
    void shouldGetActiveCommentsPublicly() {
        User author = userRepository.saveAndFlush(new User("commenter2", "commenter2@example.com", "hash123"));
        Post post = postRepository.saveAndFlush(new Post(author, "Public Comment Post", "public-comment-post", "Content"));

        commentRepository.saveAndFlush(new Comment(post, author, "First public comment"));
        commentRepository.saveAndFlush(new Comment(post, author, "Second public comment"));

        String url = "http://localhost:" + port + "/api/posts/" + post.getId() + "/comments";

        ResponseEntity<List> response = restTemplate.getForEntity(url, List.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).hasSize(2);
    }

    @Test
    void shouldCreateReplySuccessfully() {
        User author = userRepository.saveAndFlush(new User("replyauthor", "replyauthor@example.com", "hash123"));
        User replier = userRepository.saveAndFlush(new User("replier", "replier@example.com", "hash123"));
        Post post = postRepository.saveAndFlush(new Post(author, "Post for Reply", "post-for-reply", "Content"));

        Comment parentComment = commentRepository.saveAndFlush(new Comment(post, author, "Parent comment"));

        String replierToken = jwtService.generateAccessToken(replier.getId(), replier.getUsername());
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(replierToken);

        CreateCommentRequest request = new CreateCommentRequest("Reply to parent");
        HttpEntity<CreateCommentRequest> requestEntity = new HttpEntity<>(request, headers);

        String url = "http://localhost:" + port + "/api/comments/" + parentComment.getId() + "/replies";

        ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("parentId")).isEqualTo(parentComment.getId().toString());
        assertThat(response.getBody().get("authorUsername")).isEqualTo("replier");
    }

    @Test
    void shouldRejectReplyToReply() {
        User author = userRepository.saveAndFlush(new User("nesteduser", "nested@example.com", "hash123"));
        Post post = postRepository.saveAndFlush(new Post(author, "Nested Post", "nested-post", "Content"));

        Comment parentComment = commentRepository.saveAndFlush(new Comment(post, author, "Parent comment"));
        Comment replyComment = commentRepository.saveAndFlush(new Comment(post, author, parentComment, "First level reply"));

        String token = jwtService.generateAccessToken(author.getId(), author.getUsername());
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        CreateCommentRequest request = new CreateCommentRequest("Second level reply attempt");
        HttpEntity<CreateCommentRequest> requestEntity = new HttpEntity<>(request, headers);

        String url = "http://localhost:" + port + "/api/comments/" + replyComment.getId() + "/replies";

        assertThatThrownBy(() -> restTemplate.postForEntity(url, requestEntity, Map.class))
                .isInstanceOf(HttpClientErrorException.BadRequest.class)
                .satisfies(ex -> {
                    HttpClientErrorException.BadRequest badRequest = (HttpClientErrorException.BadRequest) ex;
                    assertThat(badRequest.getResponseBodyAsString()).contains("Replies cannot have replies");
                });
    }

    @Test
    void shouldRejectUnauthenticatedCommentCreation() {
        User author = userRepository.saveAndFlush(new User("noauthcommenter", "noauthc@example.com", "hash123"));
        Post post = postRepository.saveAndFlush(new Post(author, "No Auth Comment Post", "no-auth-comment-post", "Content"));

        CreateCommentRequest request = new CreateCommentRequest("Unauthenticated comment");
        String url = "http://localhost:" + port + "/api/posts/" + post.getId() + "/comments";

        assertThatThrownBy(() -> restTemplate.postForEntity(url, request, Map.class))
                .isInstanceOf(HttpClientErrorException.Forbidden.class);
    }

    @Test
    void shouldRejectDeletingCommentOwnedByAnotherUser() {
        User owner = userRepository.saveAndFlush(new User("cowner", "cowner@example.com", "hash123"));
        User attacker = userRepository.saveAndFlush(new User("cattacker", "cattacker@example.com", "hash123"));
        Post post = postRepository.saveAndFlush(new Post(owner, "Comment Delete Post", "comment-delete-post", "Content"));
        Comment comment = commentRepository.saveAndFlush(new Comment(post, owner, "Owner comment"));

        String attackerToken = jwtService.generateAccessToken(attacker.getId(), attacker.getUsername());
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(attackerToken);
        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        String url = "http://localhost:" + port + "/api/comments/" + comment.getId();

        assertThatThrownBy(() -> restTemplate.exchange(url, HttpMethod.DELETE, requestEntity, Void.class))
                .isInstanceOf(HttpClientErrorException.Forbidden.class);
    }

    @Test
    void shouldSoftDeleteCommentByOwnerAndHideFromPublicList() {
        User owner = userRepository.saveAndFlush(new User("deleterowner", "deleterowner@example.com", "hash123"));
        Post post = postRepository.saveAndFlush(new Post(owner, "Soft Delete Post", "soft-delete-post", "Content"));
        Comment comment = commentRepository.saveAndFlush(new Comment(post, owner, "To be deleted"));

        String token = jwtService.generateAccessToken(owner.getId(), owner.getUsername());
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        String deleteUrl = "http://localhost:" + port + "/api/comments/" + comment.getId();

        ResponseEntity<Void> deleteResponse = restTemplate.exchange(deleteUrl, HttpMethod.DELETE, requestEntity, Void.class);

        assertThat(deleteResponse.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);

        // Verify status changed to DELETED in DB
        Comment updatedComment = commentRepository.findById(comment.getId()).orElseThrow();
        assertThat(updatedComment.getStatus()).isEqualTo(CommentStatus.DELETED);

        // Verify comment does not appear in public list
        String getUrl = "http://localhost:" + port + "/api/posts/" + post.getId() + "/comments";
        ResponseEntity<List> getResponse = restTemplate.getForEntity(getUrl, List.class);
        assertThat(getResponse.getBody()).isEmpty();
    }
}
