package com.harshit.blog.tag;

import com.harshit.blog.AbstractIntegrationTest;
import com.harshit.blog.common.security.JwtService;
import com.harshit.blog.post.entity.Post;
import com.harshit.blog.post.entity.PostStatus;
import com.harshit.blog.post.repository.PostRepository;
import com.harshit.blog.tag.dto.TagRequest;
import com.harshit.blog.tag.entity.PostTag;
import com.harshit.blog.tag.entity.Tag;
import com.harshit.blog.tag.repository.PostTagRepository;
import com.harshit.blog.tag.repository.TagRepository;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class TagControllerIntegrationTest extends AbstractIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private PostTagRepository postTagRepository;

    @Autowired
    private JwtService jwtService;

    private final RestTemplate restTemplate = new RestTemplate();

    @Test
    void shouldAttachTagToOwnPostAndReuseExistingTag() {
        User author = userRepository.saveAndFlush(new User("tagowner", "tagowner@example.com", "hash123"));
        Post post1 = postRepository.saveAndFlush(new Post(author, "Post 1", "post-1-slug", "Content 1"));
        Post post2 = postRepository.saveAndFlush(new Post(author, "Post 2", "post-2-slug", "Content 2"));

        String token = jwtService.generateAccessToken(author.getId(), author.getUsername());
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        TagRequest request = new TagRequest("Java");
        HttpEntity<TagRequest> requestEntity = new HttpEntity<>(request, headers);

        String attachUrl1 = "http://localhost:" + port + "/api/posts/" + post1.getId() + "/tags";
        ResponseEntity<Map> response1 = restTemplate.postForEntity(attachUrl1, requestEntity, Map.class);

        assertThat(response1.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response1.getBody()).isNotNull();
        assertThat(response1.getBody().get("name")).isEqualTo("Java");
        assertThat(response1.getBody().get("slug")).isEqualTo("java");

        String tagIdStr = (String) response1.getBody().get("id");

        // Attach same tag "Java" to post2 -> should reuse existing tag ID
        String attachUrl2 = "http://localhost:" + port + "/api/posts/" + post2.getId() + "/tags";
        ResponseEntity<Map> response2 = restTemplate.postForEntity(attachUrl2, requestEntity, Map.class);

        assertThat(response2.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response2.getBody().get("id")).isEqualTo(tagIdStr);

        // Verify only 1 tag named 'Java' exists in database
        long javaTagCount = tagRepository.findAll().stream()
                .filter(t -> t.getName().equalsIgnoreCase("Java"))
                .count();
        assertThat(javaTagCount).isEqualTo(1);
    }

    @Test
    void shouldRejectAttachingTagByNonOwner() {
        User owner = userRepository.saveAndFlush(new User("tagpostowner", "tagpostowner@example.com", "hash123"));
        User attacker = userRepository.saveAndFlush(new User("tagattacker", "tagattacker@example.com", "hash123"));
        Post post = postRepository.saveAndFlush(new Post(owner, "Owner Post", "owner-post-slug", "Content"));

        String attackerToken = jwtService.generateAccessToken(attacker.getId(), attacker.getUsername());
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(attackerToken);

        TagRequest request = new TagRequest("Spring Boot");
        HttpEntity<TagRequest> requestEntity = new HttpEntity<>(request, headers);

        String attachUrl = "http://localhost:" + port + "/api/posts/" + post.getId() + "/tags";

        assertThatThrownBy(() -> restTemplate.postForEntity(attachUrl, requestEntity, Map.class))
                .isInstanceOf(HttpClientErrorException.Forbidden.class);
    }

    @Test
    void shouldRemoveTagFromOwnPost() {
        User author = userRepository.saveAndFlush(new User("tagdeleter", "tagdeleter@example.com", "hash123"));
        Post post = postRepository.saveAndFlush(new Post(author, "Tagged Post", "tagged-post-slug", "Content"));
        Tag tag = tagRepository.saveAndFlush(new Tag("PostgreSQL", "postgresql"));
        postTagRepository.saveAndFlush(new PostTag(post, tag));

        String token = jwtService.generateAccessToken(author.getId(), author.getUsername());
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        String deleteUrl = "http://localhost:" + port + "/api/posts/" + post.getId() + "/tags/" + tag.getId();

        ResponseEntity<Void> response = restTemplate.exchange(deleteUrl, HttpMethod.DELETE, requestEntity, Void.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        assertThat(postTagRepository.existsByIdPostIdAndIdTagId(post.getId(), tag.getId())).isFalse();
    }

    @Test
    void shouldFilterPublishedPostsByTag() {
        User author = userRepository.saveAndFlush(new User("filterauthor", "filterauthor@example.com", "hash123"));

        Tag javaTag = tagRepository.saveAndFlush(new Tag("Java", "java"));
        Tag pythonTag = tagRepository.saveAndFlush(new Tag("Python", "python"));

        Post javaPost = new Post(author, "Java Spring Post", "java-spring-post", "Java content");
        javaPost.setStatus(PostStatus.PUBLISHED);
        javaPost.setPublishedAt(Instant.now());
        postRepository.saveAndFlush(javaPost);
        postTagRepository.saveAndFlush(new PostTag(javaPost, javaTag));

        Post pythonPost = new Post(author, "Python Django Post", "python-django-post", "Python content");
        pythonPost.setStatus(PostStatus.PUBLISHED);
        pythonPost.setPublishedAt(Instant.now());
        postRepository.saveAndFlush(pythonPost);
        postTagRepository.saveAndFlush(new PostTag(pythonPost, pythonTag));

        String feedUrl = "http://localhost:" + port + "/api/posts?tag=java";

        ResponseEntity<Map> response = restTemplate.getForEntity(feedUrl, Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();

        List<Map<String, Object>> posts = (List<Map<String, Object>>) response.getBody().get("posts");
        assertThat(posts).hasSize(1);
        assertThat(posts.get(0).get("slug")).isEqualTo("java-spring-post");
    }

    @Test
    void shouldGetAllTagsPublicly() {
        tagRepository.saveAndFlush(new Tag("Docker", "docker"));
        tagRepository.saveAndFlush(new Tag("Kubernetes", "kubernetes"));

        String url = "http://localhost:" + port + "/api/tags";

        ResponseEntity<List> response = restTemplate.getForEntity(url, List.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().size()).isGreaterThanOrEqualTo(2);
    }
}
