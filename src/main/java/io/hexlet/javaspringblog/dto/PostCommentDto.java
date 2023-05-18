package io.hexlet.javaspringblog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public final class PostCommentDto {
    @NotNull
    @NotBlank
    @Size(max = 200)
    private String body;

    private Long postId;

}
