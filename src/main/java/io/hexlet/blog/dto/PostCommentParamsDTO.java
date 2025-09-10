package io.hexlet.blog.dto;

import java.util.Date;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PostCommentParamsDTO {
    private String nameCont;
    private Long authorId;
    private Long postId;
    private Date createdAtGt;
}
