package com.harshit.blog.like;

import com.harshit.blog.AbstractIntegrationTest;
import com.harshit.blog.like.entity.PostLike;
import com.harshit.blog.like.repository.PostLikeRepository;
import com.harshit.blog.post.entity.Post;
import com.harshit.blog.post.repository.PostRepository;
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
class PostLikeRepositoryIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostLikeRepository postLikeRepository;

    @Test
    void shouldPersistPostLike() {

        User user = new User(
                "likeauthor",
                "likeauthor@example.com",
                "hashed-password"
        );

        userRepository.saveAndFlush(user);

        Post post = new Post(
                user,
                "Like Post",
                "like-post",
                "Content."
        );

        postRepository.saveAndFlush(post);

        PostLike postLike = new PostLike(post, user);

        PostLike saved =
                postLikeRepository.saveAndFlush(postLike);

        assertThat(saved.getId()).isNotNull();

        assertThat(saved.getId().getPostId())
                .isEqualTo(post.getId());

        assertThat(saved.getId().getUserId())
                .isEqualTo(user.getId());

        assertThat(
                postLikeRepository.existsByIdPostIdAndIdUserId(
                        post.getId(),
                        user.getId()
                )
        ).isTrue();
    }

    @Test
    void shouldCountLikesForPost() {

        User userOne = new User(
                "likeuserone",
                "likeuserone@example.com",
                "hashed-password"
        );

        User userTwo = new User(
                "likeusertwo",
                "likeusertwo@example.com",
                "hashed-password"
        );

        userRepository.saveAllAndFlush(
                List.of(userOne, userTwo)
        );

        Post post = new Post(
                userOne,
                "Popular Post",
                "popular-post",
                "Content."
        );

        postRepository.saveAndFlush(post);

        postLikeRepository.saveAllAndFlush(
                List.of(
                        new PostLike(post, userOne),
                        new PostLike(post, userTwo)
                )
        );

        assertThat(
                postLikeRepository.countByIdPostId(post.getId())
        ).isEqualTo(2);
    }

    @Test
    void shouldDeleteLike() {

        User user = new User(
                "unlikeuser",
                "unlikeuser@example.com",
                "hashed-password"
        );

        userRepository.saveAndFlush(user);

        Post post = new Post(
                user,
                "Unlike Post",
                "unlike-post",
                "Content."
        );

        postRepository.saveAndFlush(post);

        PostLike like = new PostLike(post, user);

        postLikeRepository.saveAndFlush(like);

        assertThat(
                postLikeRepository.existsByIdPostIdAndIdUserId(
                        post.getId(),
                        user.getId()
                )
        ).isTrue();

        postLikeRepository.deleteByIdPostIdAndIdUserId(
                post.getId(),
                user.getId()
        );

        postLikeRepository.flush();

        assertThat(
                postLikeRepository.existsByIdPostIdAndIdUserId(
                        post.getId(),
                        user.getId()
                )
        ).isFalse();
    }
}
