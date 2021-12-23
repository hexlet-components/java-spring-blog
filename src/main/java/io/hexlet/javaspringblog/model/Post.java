package io.hexlet.javaspringblog.model;

import java.util.Date;
import java.util.Set;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
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

import static javax.persistence.GenerationType.AUTO;
import static javax.persistence.TemporalType.TIMESTAMP;
import javax.persistence.*;
import javax.validation.constraints.NotNull;

import lombok.*;
import static javax.persistence.CascadeType.ALL;
import static javax.persistence.FetchType.EAGER;

@Entity
@Getter
@Setter
@Table(name = "posts")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Post {

    @Id
    @GeneratedValue(strategy = AUTO)
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

}
