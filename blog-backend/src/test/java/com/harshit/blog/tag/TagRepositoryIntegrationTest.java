package com.harshit.blog.tag;

import com.harshit.blog.AbstractIntegrationTest;
import com.harshit.blog.post.entity.Post;
import com.harshit.blog.post.repository.PostRepository;
import com.harshit.blog.tag.entity.PostTag;
import com.harshit.blog.tag.entity.Tag;
import com.harshit.blog.tag.repository.PostTagRepository;
import com.harshit.blog.tag.repository.TagRepository;
import com.harshit.blog.user.entity.User;
import com.harshit.blog.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class TagRepositoryIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private PostTagRepository postTagRepository;

    @Test
    void shouldPersistTagAndPostTagRelationship() {

        User user = new User(
                "tagauthor",
                "tagauthor@example.com",
                "hashed-password"
        );

        userRepository.saveAndFlush(user);

        Post post = new Post(
                user,
                "Java Post",
                "java-post",
                "Java content."
        );

        postRepository.saveAndFlush(post);

        Tag tag = new Tag(
                "Java",
                "java"
        );

        tagRepository.saveAndFlush(tag);

        PostTag postTag = new PostTag(
                post,
                tag
        );

        PostTag saved = postTagRepository.saveAndFlush(postTag);

        assertThat(saved.getId()).isNotNull();

        assertThat(saved.getId().getPostId())
                .isEqualTo(post.getId());

        assertThat(saved.getId().getTagId())
                .isEqualTo(tag.getId());

        assertThat(
                postTagRepository.existsByIdPostIdAndIdTagId(
                        post.getId(),
                        tag.getId()
                )
        ).isTrue();
    }

    @Test
    void shouldFindTagsForPost() {

        User user = new User(
                "tagqueryauthor",
                "tagqueryauthor@example.com",
                "hashed-password"
        );

        userRepository.saveAndFlush(user);

        Post post = new Post(
                user,
                "Spring Post",
                "spring-post",
                "Spring content."
        );

        postRepository.saveAndFlush(post);

        Tag java = new Tag("Java", "java-query");
        Tag spring = new Tag("Spring", "spring-query");

        tagRepository.saveAllAndFlush(
                List.of(java, spring)
        );

        postTagRepository.saveAllAndFlush(
                List.of(
                        new PostTag(post, java),
                        new PostTag(post, spring)
                )
        );

        List<PostTag> relationships =
                postTagRepository.findByIdPostId(post.getId());

        assertThat(relationships)
                .hasSize(2);

        assertThat(
                relationships.stream()
                        .map(postTag -> postTag.getTag().getSlug())
                )
                .containsExactlyInAnyOrder(
                        "java-query",
                        "spring-query"
                );
    }
}
