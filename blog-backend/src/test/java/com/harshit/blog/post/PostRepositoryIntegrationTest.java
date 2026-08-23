package com.harshit.blog.post;

import com.harshit.blog.AbstractIntegrationTest;
import com.harshit.blog.post.entity.Post;
import com.harshit.blog.post.entity.PostStatus;
import com.harshit.blog.post.repository.PostRepository;
import com.harshit.blog.user.entity.User;
import com.harshit.blog.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class PostRepositoryIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldPersistAndRetrievePost() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        User user = new User(
                "author_" + suffix,
                "author_" + suffix + "@example.com",
                "hashed-password"
        );

        userRepository.saveAndFlush(user);

        Post post = new Post(
                user,
                "My First Post",
                "my-first-post-" + suffix,
                "This is the content."
        );

        Post saved = postRepository.saveAndFlush(post);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getTitle()).isEqualTo("My First Post");
        assertThat(saved.getSlug()).isEqualTo("my-first-post-" + suffix);
        assertThat(saved.getStatus()).isEqualTo(PostStatus.DRAFT);
        assertThat(saved.getPublishedAt()).isNull();
        assertThat(saved.getAuthor().getId()).isEqualTo(user.getId());
    }

    @Test
    void shouldFindPostBySlugIgnoringCase() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        User user = new User(
                "slugauthor_" + suffix,
                "slugauthor_" + suffix + "@example.com",
                "hashed-password"
        );

        userRepository.saveAndFlush(user);

        Post post = new Post(
                user,
                "Slug Test",
                "spring-boot-post-" + suffix,
                "Content."
        );

        postRepository.saveAndFlush(post);

        Optional<Post> found =
                postRepository.findBySlugIgnoreCase("SPRING-BOOT-POST-" + suffix);

        assertThat(found).isPresent();
        assertThat(found.get().getTitle()).isEqualTo("Slug Test");
    }

    @Test
    void shouldFindPublishedPosts() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        User user = new User(
                "pubauthor_" + suffix,
                "pubauthor_" + suffix + "@example.com",
                "hashed-password"
        );

        userRepository.saveAndFlush(user);

        Post draft = new Post(
                user,
                "Draft",
                "draft-post-" + suffix,
                "Draft content."
        );

        Post published = new Post(
                user,
                "Published",
                "published-post-" + suffix,
                "Published content."
        );

        published.setStatus(PostStatus.PUBLISHED);
        published.setPublishedAt(Instant.now());

        postRepository.saveAllAndFlush(
                java.util.List.of(draft, published)
        );

        Page<Post> result = postRepository.findByStatus(
                PostStatus.PUBLISHED,
                PageRequest.of(0, 10)
        );

        assertThat(result.getContent())
                .extracting(Post::getSlug)
                .contains("published-post-" + suffix)
                .doesNotContain("draft-post-" + suffix);
    }
}
