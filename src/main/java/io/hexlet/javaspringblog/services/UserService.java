package io.hexlet.javaspringblog.services;

import io.hexlet.javaspringblog.dtos.UserRegistrationDto;

public interface UserService {

    void registerNewUserAccount(final UserRegistrationDto dto);
}
