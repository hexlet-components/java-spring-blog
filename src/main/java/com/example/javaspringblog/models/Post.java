package com.example.javaspringblog.models;

import javax.persistence.Entity;
// import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter @NoArgsConstructor
public class Post {
    @Id
    // @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // @NotBlank(message = "Body can't be empty")
    private String title;

    // @NotBlank(message = "Body can't be empty")
    private String body;

    public Post(Long id, String title, String body) {
        this.id = id;
        this.title = title;
        this.body = body;
    }
}
