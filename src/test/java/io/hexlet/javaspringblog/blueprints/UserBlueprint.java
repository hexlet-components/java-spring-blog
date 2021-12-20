package io.hexlet.javaspringblog.blueprints;

import com.tobedevoured.modelcitizen.annotation.Blueprint;
import com.tobedevoured.modelcitizen.annotation.Default;
import com.tobedevoured.modelcitizen.callback.AfterCreateCallback;
import com.tobedevoured.modelcitizen.spring.annotation.SpringBlueprint;
import io.hexlet.javaspringblog.models.user.User;
import io.hexlet.javaspringblog.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Blueprint(User.class)
@SpringBlueprint(beanClass = User.class)
public class UserBlueprint {

    @Autowired
    UserRepository userRepository;

    @Default
    String email = "test_email";

    @Default
    String name = "test_user";

    @Default
    String password = new BCryptPasswordEncoder().encode("pwd");

    AfterCreateCallback<User> afterCreateCallback = new AfterCreateCallback<>() {
        public User afterCreate(User model) {
            return userRepository.save(model);
        }
    };

}
