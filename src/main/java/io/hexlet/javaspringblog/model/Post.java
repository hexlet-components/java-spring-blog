package io.hexlet.javaspringblog.model;

import io.hexlet.javaspringblog.model.PostComment;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import java.util.Set;
import javax.persistence.Entity;
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

import static javax.persistence.CascadeType.ALL;
import static javax.persistence.FetchType.EAGER;
import static javax.persistence.GenerationType.AUTO;

@Getter
@Setter
@ToString(callSuper = true)
@NoArgsConstructor
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Post {

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
