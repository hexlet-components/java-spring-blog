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
public final class PostDto {
    private @NotBlank @Size(min = 3, max = 1000) String title;

    private String body;

    private Set<Long> commentIds;

}
