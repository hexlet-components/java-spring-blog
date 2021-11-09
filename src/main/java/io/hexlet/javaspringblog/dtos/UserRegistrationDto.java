package io.hexlet.javaspringblog.dtos;

import io.hexlet.javaspringblog.models.user.UserRole;
import lombok.Data;

@Data
public class UserRegistrationDto {

   private final String email;

   private final String name;

   private final String password;

   private final UserRole role;

}
