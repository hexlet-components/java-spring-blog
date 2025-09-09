package io.hexlet.blog.dto;

import java.util.Date;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PostDTO {
    private Long id;
    private Long authorId;
    private String slug;
    private String name;
    private String body;
    private Date createdAt;
}
