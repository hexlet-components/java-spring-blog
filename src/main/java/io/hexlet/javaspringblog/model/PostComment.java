package io.hexlet.javaspringblog.model;

import java.util.Date;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import static javax.persistence.GenerationType.IDENTITY;
import static javax.persistence.TemporalType.TIMESTAMP;

import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
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

