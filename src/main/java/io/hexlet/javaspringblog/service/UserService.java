package io.hexlet.javaspringblog.service;

import io.hexlet.javaspringblog.dto.UserCreateDto;
import io.hexlet.javaspringblog.model.User;

public interface UserService {

    User createNewUser(UserCreateDto registrationDto);

    String getCurrentUserName();

    User getCurrentUser();
}
