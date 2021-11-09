package io.hexlet.javaspringblog.controllers;

import io.hexlet.javaspringblog.dtos.UserRegistrationDto;
import io.hexlet.javaspringblog.services.UserService;
import javax.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static io.hexlet.javaspringblog.controllers.UserController.PUBLIC_CONTROLLER_PATH;

@RestController
@AllArgsConstructor
@RequestMapping(PUBLIC_CONTROLLER_PATH)
public class UserController {

    public static final String PUBLIC_CONTROLLER_PATH = "/user";
    public static final String LOGIN = "/login";
    public static final String REG = "/register";

    private final UserService userService;

    @PostMapping(REG)
    public void register(@RequestBody @Valid UserRegistrationDto registrationDto) {
        userService.registerNewUserAccount(registrationDto);
    }

    @PostMapping(LOGIN)
    public String login() {
        return "Success!";
    }

}
