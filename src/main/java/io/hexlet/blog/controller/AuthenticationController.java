package io.hexlet.blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import io.hexlet.blog.dto.AuthRequest;
import io.hexlet.blog.util.JWTUtils;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
public class AuthenticationController {
    @Autowired
    private final JWTUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public String create(@RequestBody AuthRequest authRequest) {
        var authentication = new UsernamePasswordAuthenticationToken(
            authRequest.username(), authRequest.password());

        authenticationManager.authenticate(authentication);

        var token = jwtUtils.generateToken(authRequest.username());
        return token;
    }
}
