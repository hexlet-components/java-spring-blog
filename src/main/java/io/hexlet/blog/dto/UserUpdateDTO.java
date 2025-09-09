package io.hexlet.blog.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserUpdateDTO {
    @NotNull private String firstName;
    // private String lastName;
}
