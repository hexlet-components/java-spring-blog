package io.hexlet.blog.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Setter
@Getter
public class Page {
    private String slug;
    private String name;
    private String body;
}
