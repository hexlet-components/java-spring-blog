package io.hexlet.javaspringblog.controller;

import io.hexlet.javaspringblog.dto.LoginDto;
import io.hexlet.javaspringblog.service.UserAuthenticationService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static io.hexlet.javaspringblog.controller.AuthController.LOGIN;

@AllArgsConstructor
@RestController
@RequestMapping("${base-url}" + LOGIN)
public class AuthController {

    public static final String LOGIN = "/login";

    private final UserAuthenticationService authenticationService;

    @PostMapping
    public String login(@RequestBody final LoginDto loginDto) {
        return authenticationService.login(loginDto.getEmail(), loginDto.getPassword());
    }

}
