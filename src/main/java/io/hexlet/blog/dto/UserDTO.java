package io.hexlet.blog.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserDTO {
    private Long id;

    @Email
    @NotBlank
    private String username;

    private String firstName;

    private String lastName;

    @Size(min = 3, max = 100)
    private String password;
}
