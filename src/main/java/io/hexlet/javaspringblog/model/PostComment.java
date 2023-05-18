package io.hexlet.javaspringblog.model;

import java.util.Date;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import static jakarta.persistence.GenerationType.IDENTITY;
import static jakarta.persistence.TemporalType.TIMESTAMP;

import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;
import lombok.ToString;

@Entity
@Getter
@Setter
@Table(name = "post_comments")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostComment {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @ManyToOne
    private User author;

    @NotNull
    @NotBlank
    @Size(max = 200)
    private String body;

    @NotNull
    @ManyToOne
    @ToString.Exclude
    private Post post;

    @CreationTimestamp
    @Temporal(TIMESTAMP)
    private Date createdAt;

    public PostComment(final Long id) {
        this.id = id;
    }
}

