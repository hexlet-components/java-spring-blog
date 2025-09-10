package io.hexlet.blog;

import io.hexlet.blog.model.Page;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import net.datafaker.Faker;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
@EnableJpaAuditing
@RequestMapping("/api")
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    private List<Page> pages = new ArrayList<Page>();

    @PostMapping("/pages")
    @ResponseStatus(HttpStatus.CREATED)
    public Page create(@RequestBody Page page) {
        pages.add(page);
        return page;
    }

    @DeleteMapping("/pages/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void destroy(@PathVariable String id) {
        pages.removeIf(p -> p.getSlug().equals(id));
    }

    @Bean
    public Faker getFaker() {
        return new Faker();
    }

    @GetMapping("/pages")
    @ResponseStatus(HttpStatus.OK)
    public List<Page> index(@RequestParam(defaultValue = "10") Integer limit) {
        return pages.stream().limit(limit).toList();
    }

    @GetMapping("/pages/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Optional<Page> show(@PathVariable String id) {
        var page = pages.stream().filter(p -> p.getSlug().equals(id)).findFirst();
        return page;
    }

    @PutMapping("/pages/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Page update(@PathVariable String id, @RequestBody Page data) {
        var maybePage = pages.stream().filter(p -> p.getSlug().equals(id)).findFirst();
        if (maybePage.isPresent()) {
            var page = maybePage.get();
            page.setSlug(data.getSlug());
            page.setName(data.getName());
            page.setBody(data.getBody());
        }
        return data;
    }
}
