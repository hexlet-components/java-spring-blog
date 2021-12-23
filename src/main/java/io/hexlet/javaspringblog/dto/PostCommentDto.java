package io.hexlet.javaspringblog.dto;

import java.util.Set;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import javax.validation.constraints.NotNull;
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
