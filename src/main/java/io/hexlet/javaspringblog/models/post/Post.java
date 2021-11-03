package io.hexlet.javaspringblog.models.post;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import io.hexlet.javaspringblog.models.AuditingEntityEntity;
import java.util.Set;
import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import static io.hexlet.javaspringblog.models.post.PostStatus.CREATED;
import static javax.persistence.CascadeType.ALL;
import static javax.persistence.EnumType.STRING;
import static javax.persistence.FetchType.EAGER;
import static javax.persistence.GenerationType.AUTO;

@Getter
@Setter
@ToString(callSuper = true)
@NoArgsConstructor
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Post extends AuditingEntityEntity {

    @Id
    @GeneratedValue(strategy = AUTO)
    private Long id;

    @NotNull
    @NotBlank
    @Size(min = 2, max = 50)
    private String title;

    @NotNull
    @NotBlank
    @Size(max = 1000)
    private String body;

    @NotNull
    @Enumerated(STRING)
    private PostStatus postStatus = CREATED;

    @ToString.Exclude
    @OneToMany(mappedBy = "post", cascade = ALL, orphanRemoval = true, fetch = EAGER)
    private Set<PostComment> postComments;

    public void addComment(final PostComment postComment) {
        postComments.add(postComment);
        postComment.setPost(this);
    }

    public void removeComment(final PostComment postComment) {
        postComments.remove(postComment);
        postComment.setPost(null);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public boolean equals(Object obj) {
        return this == obj || id != null && obj instanceof Post other && id.equals(other.id);
    }
}
