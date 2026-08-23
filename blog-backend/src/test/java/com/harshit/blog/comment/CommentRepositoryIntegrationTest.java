package com.harshit.blog.comment;

import com.harshit.blog.AbstractIntegrationTest;
import com.harshit.blog.comment.entity.Comment;
import com.harshit.blog.comment.entity.CommentStatus;
import com.harshit.blog.comment.repository.CommentRepository;
import com.harshit.blog.post.entity.Post;
import com.harshit.blog.post.repository.PostRepository;
import com.harshit.blog.user.entity.User;
import com.harshit.blog.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class CommentRepositoryIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Test
    void shouldPersistTopLevelComment() {

        User user = new User(
                "commentauthor",
                "commentauthor@example.com",
                "hashed-password"
        );

        userRepository.saveAndFlush(user);

        Post post = new Post(
                user,
                "Comment Post",
                "comment-post",
                "Post content."
        );

        postRepository.saveAndFlush(post);

        Comment comment = new Comment(
                post,
                user,
                "This is a comment."
        );

        Comment saved =
                commentRepository.saveAndFlush(comment);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getPost().getId())
                .isEqualTo(post.getId());
        assertThat(saved.getAuthor().getId())
                .isEqualTo(user.getId());
        assertThat(saved.getParent())
                .isNull();
        assertThat(saved.getStatus())
                .isEqualTo(CommentStatus.ACTIVE);
    }

    @Test
    void shouldPersistReplyToComment() {

        User user = new User(
                "replyauthor",
                "replyauthor@example.com",
                "hashed-password"
        );

        userRepository.saveAndFlush(user);

        Post post = new Post(
                user,
                "Reply Post",
                "reply-post",
                "Post content."
        );

        postRepository.saveAndFlush(post);

        Comment parent = new Comment(
                post,
                user,
                "Parent comment."
        );

        commentRepository.saveAndFlush(parent);

        Comment reply = new Comment(
                post,
                user,
                parent,
                "Reply comment."
        );

        Comment savedReply =
                commentRepository.saveAndFlush(reply);

        assertThat(savedReply.getParent())
                .isNotNull();

        assertThat(savedReply.getParent().getId())
                .isEqualTo(parent.getId());
    }

    @Test
    void shouldFindTopLevelCommentsOnly() {

        User user = new User(
                "queryauthor",
                "queryauthor@example.com",
                "hashed-password"
        );

        userRepository.saveAndFlush(user);

        Post post = new Post(
                user,
                "Query Post",
                "query-post",
                "Content."
        );

        postRepository.saveAndFlush(post);

        Comment parent = new Comment(
                post,
                user,
                "Parent."
        );

        commentRepository.saveAndFlush(parent);

        Comment reply = new Comment(
                post,
                user,
                parent,
                "Reply."
        );

        commentRepository.saveAndFlush(reply);

        var result =
                commentRepository
                        .findByPostIdAndParentIsNullAndStatus(
                                post.getId(),
                                CommentStatus.ACTIVE,
                                PageRequest.of(
                                        0,
                                        20
                                )
                        );

        assertThat(result.getContent())
                .hasSize(1);

        assertThat(result.getContent().getFirst().getId())
                .isEqualTo(parent.getId());
    }

    @Test
    void shouldFindReplies() {

        User user = new User(
                "repliesauthor",
                "repliesauthor@example.com",
                "hashed-password"
        );

        userRepository.saveAndFlush(user);

        Post post = new Post(
                user,
                "Replies Post",
                "replies-post",
                "Content."
        );

        postRepository.saveAndFlush(post);

        Comment parent = new Comment(
                post,
                user,
                "Parent."
        );

        commentRepository.saveAndFlush(parent);

        Comment replyOne = new Comment(
                post,
                user,
                parent,
                "Reply one."
        );

        Comment replyTwo = new Comment(
                post,
                user,
                parent,
                "Reply two."
        );

        commentRepository.saveAllAndFlush(
                List.of(replyOne, replyTwo)
        );

        List<Comment> replies =
                commentRepository
                        .findByParentIdAndStatusOrderByCreatedAtAsc(
                                parent.getId(),
                                CommentStatus.ACTIVE
                        );

        assertThat(replies)
                .hasSize(2);

        assertThat(replies)
                .extracting(Comment::getContent)
                .containsExactly(
                        "Reply one.",
                        "Reply two."
                );
    }
}
