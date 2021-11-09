package io.hexlet.javaspringblog.services;

import io.hexlet.javaspringblog.dtos.UserRegistrationDto;
import io.hexlet.javaspringblog.models.user.User;
import io.hexlet.javaspringblog.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    @Override
    public void registerNewUserAccount(final UserRegistrationDto userDto) {
        final User user = new User();
        user.setEmail(userDto.getEmail());
        user.setPassword(encodePassword(userDto));
        user.setName(userDto.getName());
        user.setRole(userDto.getRole());

        userRepository.save(user);
    }

    private String encodePassword(final UserRegistrationDto dto) {
        return encoder.encode(dto.getPassword());
    }
}
