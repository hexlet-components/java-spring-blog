package io.hexlet.javaspringblog.services;

import io.hexlet.javaspringblog.dtos.UserRegistrationDto;
import io.hexlet.javaspringblog.models.user.User;

public interface UserService {

    User registerNewUserAccount(final UserRegistrationDto dto);
}
