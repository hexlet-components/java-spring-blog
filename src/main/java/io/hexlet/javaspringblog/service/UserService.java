package io.hexlet.javaspringblog.service;

import io.hexlet.javaspringblog.dto.UserDto;
import io.hexlet.javaspringblog.model.User;

public interface UserService {

    User createNewUser(UserDto userDto);

    User updateUser(long id, UserDto userDto);

    String getCurrentUserName();

    User getCurrentUser();
}
