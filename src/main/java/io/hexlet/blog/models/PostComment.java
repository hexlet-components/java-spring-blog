package io.hexlet.blog.models;

import static jakarta.persistence.GenerationType.IDENTITY;

import java.util.Date;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(includeFieldNames = true, onlyExplicitlyIncluded = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Table(name = "post_comments")
public class PostComment {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @CreatedBy
    private User author;

    @NotNull
    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String body;

    @NotNull
    @ManyToOne
    private Post post;

    @LastModifiedDate
    private Date updatedAt;

    @CreatedDate
    private Date createdAt;
}
