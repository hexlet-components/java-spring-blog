package io.hexlet.blog.dto;

import org.openapitools.jackson.nullable.JsonNullable;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Setter
@Getter
public class PostDTO {
    private Long id;
    private JsonNullable<Long> authorId;
    private JsonNullable<String> slug;
    private JsonNullable<String> name;
    private JsonNullable<String> body;
    private String createdAt;
}
