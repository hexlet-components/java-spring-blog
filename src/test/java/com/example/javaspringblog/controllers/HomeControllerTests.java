package com.example.javaspringblog.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.javaspringblog.blueprints.PostBlueprint;
import com.example.javaspringblog.models.Post;
import com.example.javaspringblog.repositories.PostRepository;
import com.tobedevoured.modelcitizen.ModelFactory;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import lombok.extern.slf4j.Slf4j;

@SpringBootTest
@AutoConfigureMockMvc
@Slf4j
class HomeControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PostRepository postRepository;

    // @Autowired
    // private ModelFactory modelFactory;

    @Test
    void index() throws Exception {
        // modelFactory.registerBlueprint(PostBlueprint.class);
        // var post = modelFactory.createModel(Post.class);
        // postRepository.save(post);
        // System.out.println("JOPA!");

        mockMvc.perform(get("/")).andExpect(status().isOk());
    }
}
