package io.hexlet.blog.component;

import java.util.stream.IntStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import io.hexlet.blog.model.Post;
import io.hexlet.blog.model.User;
import io.hexlet.blog.repository.PostRepository;
import io.hexlet.blog.repository.UserRepository;
import io.hexlet.blog.service.CustomUserDetailsService;
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
        userData.setEmail(email);
        userData.setPasswordDigest("qwerty");
        userService.createUser(userData);

        var user = userRepository.findByEmail(email).get();

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
