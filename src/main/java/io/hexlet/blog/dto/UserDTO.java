package io.hexlet.blog.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserDTO {
    private Long id;

    private String username;

    private String firstName;

    private String lastName;

    private String password;
}
