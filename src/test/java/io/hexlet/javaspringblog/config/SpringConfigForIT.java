package io.hexlet.javaspringblog.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.client.RestTemplate;

import static io.hexlet.javaspringblog.config.SpringConfigForIT.TEST_PROFILE;

@Configuration
@Profile(TEST_PROFILE)
@EnableAspectJAutoProxy
@ComponentScan(basePackages = "io.hexlet.javaspringblog")
@PropertySource(value = "classpath:/config/application.yml")
public class SpringConfigForIT {

    public static final String TEST_PROFILE = "test";

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplateBuilder().build();
    }
}
