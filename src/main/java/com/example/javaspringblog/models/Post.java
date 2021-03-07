package com.example.javaspringblog.models;

import java.time.Instant;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String title;

    // @NotBlank(message = "Body can't be empty")
    private String body;

    private Instant createdAt;

    public Post(Long id, String title, String body) {
        this.id = id;
        this.title = title;
        this.body = body;
    }
}
