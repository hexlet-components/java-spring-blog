package io.hexlet.javaspringblog.dto;

import java.util.Set;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
