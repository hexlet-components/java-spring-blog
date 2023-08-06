package io.hexlet.blog.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Setter
@Getter
public class PostDTO {
    private Long id;
    private Long authorId;
    private String slug;
    private String name;
}
