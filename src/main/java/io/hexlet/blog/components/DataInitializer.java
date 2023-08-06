package io.hexlet.blog.components;

import java.util.stream.IntStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import io.hexlet.blog.models.Post;
import io.hexlet.blog.models.User;
import io.hexlet.blog.repositories.PostRepository;
import io.hexlet.blog.repositories.UserRepository;
import io.hexlet.blog.services.CustomUserDetailsService;
import lombok.AllArgsConstructor;
import net.datafaker.Faker;

@Component
@AllArgsConstructor
public class DataInitializer implements ApplicationRunner {

    @Autowired
    private final PostRepository postRepository;

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final CustomUserDetailsService userService;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        var email = "hexlet@example.com";
        var userData = new User();
        userData.setUsername(email);
        userData.setPassword("qwerty");
        userService.createUser(userData);

        var user = userRepository.findByUsername(email).get();

        var faker = new Faker();
        IntStream.range(1, 10).forEach(i -> {
            var post = new Post();
            post.setName(faker.book().title());
            var paragraphs = faker.lorem().paragraphs(5);
            post.setBody(String.join("\n", paragraphs));
            post.setSlug(faker.internet().slug());
            post.setAuthor(user);
            postRepository.save(post);
        });
    }
}
