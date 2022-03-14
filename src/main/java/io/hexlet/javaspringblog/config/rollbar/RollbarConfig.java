package io.hexlet.javaspringblog.config.rollbar;

import com.rollbar.notifier.Rollbar;
import com.rollbar.notifier.config.Config;
import com.rollbar.spring.webmvc.RollbarSpringConfigBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.stereotype.*;
import org.springframework.beans.factory.annotation.*;


@Configuration()
@EnableWebMvc
@ComponentScan({

// UPDATE TO YOUR PROJECT PACKAGE
    "io.hexlet.javaspringblog"

})
public class RollbarConfig {

    // Добавляем токен через переменные окружения
    @Value("${rollbar_token}")
    private String rollbarToken;

    /**
     * Register a Rollbar bean to configure App with Rollbar.
     */
    @Bean
    public Rollbar rollbar() {

    return new Rollbar(getRollbarConfigs(rollbarToken));
    }

    private Config getRollbarConfigs(String accessToken) {

    return RollbarSpringConfigBuilder.withAccessToken(accessToken)
            .environment("development")
            .build();
    }
}
