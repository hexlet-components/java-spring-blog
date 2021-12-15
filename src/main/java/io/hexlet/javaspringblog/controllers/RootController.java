package io.hexlet.javaspringblog.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

// TODO: без этого контроллера роутинг на фронте не работает,
// так как бек перехватывает запросы и отвечает 404
// Возможно есть более правильный подход
@Controller
public class RootController {

    @GetMapping(value = {"/{regex:\\w+}", "/**/{regex:\\w+}"})
    public String forward404() {
        return "forward:/";
    }
}
