package io.hexlet.blog.dto;

import java.util.Date;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PostCommentDTO {
    private Long id;
    private Long authorId;
    private Long postId;
    private String body;
    private Date createdAt;
}
