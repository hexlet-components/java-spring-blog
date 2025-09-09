package io.hexlet.blog.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.openapitools.jackson.nullable.JsonNullable;

@Setter
@Getter
public class PostUpdateDTO {
    @NotNull private JsonNullable<Long> authorId;

    @NotNull private JsonNullable<String> slug;

    @NotNull private JsonNullable<String> name;

    @NotNull private JsonNullable<String> body;
}
