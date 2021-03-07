package com.example.javaspringblog.models.post;

import java.time.Instant;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.example.javaspringblog.models.Post;

import org.springframework.data.annotation.CreatedDate;

import lombok.Data;

@Entity
@Data
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String body;

    @ManyToOne
    private Post post;

    @CreatedDate
    private Instant createdAt;

    public Comment(Long id, String body) {
        this.id = id;
        this.body = body;
    }
}

