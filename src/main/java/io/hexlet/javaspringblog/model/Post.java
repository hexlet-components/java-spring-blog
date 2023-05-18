package io.hexlet.javaspringblog.model;

import java.util.Date;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import static jakarta.persistence.GenerationType.IDENTITY;
import static jakarta.persistence.TemporalType.TIMESTAMP;

@Entity
@Getter
@Setter
@Table(name = "posts")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Post {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @ManyToOne
    private User author;

    @NotNull
    @NotBlank
    @Size(min = 2, max = 50)
    private String title;

    @NotNull
    @NotBlank
    @Size(max = 200)
    private String body;

    // @ToString.Exclude
    // @OneToMany(mappedBy = "post", cascade = ALL, orphanRemoval = true, fetch = EAGER)
    // private Set<PostComment> postComments;

    @CreationTimestamp
    @Temporal(TIMESTAMP)
    private Date createdAt;

    public Post(final Long id) {
        this.id = id;
    }
}
