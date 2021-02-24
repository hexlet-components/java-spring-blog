package com.example.javaspringblog.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("msg", "Howdy, World");
        model.addAttribute("title", "Howdy, World");
        return "index";
    }
}
