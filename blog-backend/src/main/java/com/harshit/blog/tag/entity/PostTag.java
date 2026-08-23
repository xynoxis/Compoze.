package com.harshit.blog.tag.entity;

import com.harshit.blog.post.entity.Post;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

@Entity
@Table(name = "post_tags")
public class PostTag {

    @EmbeddedId
    private PostTagId id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("postId")
    @JoinColumn(
            name = "post_id",
            nullable = false,
            foreignKey = @jakarta.persistence.ForeignKey(
                    name = "fk_post_tags_post"
            )
    )
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("tagId")
    @JoinColumn(
            name = "tag_id",
            nullable = false,
            foreignKey = @jakarta.persistence.ForeignKey(
                    name = "fk_post_tags_tag"
            )
    )
    private Tag tag;

    protected PostTag() {
        // Required by JPA.
    }

    public PostTag(Post post, Tag tag) {
        this.post = post;
        this.tag = tag;

        this.id = new PostTagId(
                post.getId(),
                tag.getId()
        );
    }

    public PostTagId getId() {
        return id;
    }

    public Post getPost() {
        return post;
    }

    public Tag getTag() {
        return tag;
    }
}
