package io.hexlet.javaspringblog.controllers;

import io.hexlet.javaspringblog.dtos.UserRegistrationDto;
import io.hexlet.javaspringblog.models.user.User;
import io.hexlet.javaspringblog.repositories.UserRepository;
import io.hexlet.javaspringblog.services.UserService;
import javax.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import static io.hexlet.javaspringblog.controllers.UserController.USER_CONTROLLER_PATH;
import static org.springframework.http.HttpStatus.CREATED;

@RestController
@AllArgsConstructor
@RequestMapping(USER_CONTROLLER_PATH)
public class UserController {

    public static final String USER_CONTROLLER_PATH = "/users";
    public static final String LOGIN = "/login";
    public static final String REG = "/register";
    public static final String ID = "{id}";

    private static final String ADMIN_ONLY = "hasRole(T(io.hexlet.javaspringblog.models.user.UserRole).ADMIN.name())";

    private final UserService userService;
    private final UserRepository userRepository;

    @PostMapping(REG)
    @ResponseStatus(CREATED)
    public User register(@RequestBody @Valid UserRegistrationDto registrationDto) {
        return userService.registerNewUserAccount(registrationDto);
    }

    @PostMapping(LOGIN)
    public String login() {
        return "Success!";
    }

    @DeleteMapping(ID)
    @PreAuthorize(ADMIN_ONLY)
    public void delete(@PathVariable final long id) {
        userRepository.deleteById(id);
    }
}
