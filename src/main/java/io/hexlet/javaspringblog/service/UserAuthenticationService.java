package io.hexlet.javaspringblog.service;

import io.hexlet.javaspringblog.model.User;
import java.util.Optional;

public interface UserAuthenticationService {

    String login(String username, String password);

    Optional<User> findByToken(String token);

}
