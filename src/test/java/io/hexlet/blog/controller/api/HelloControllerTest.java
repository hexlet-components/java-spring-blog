package io.hexlet.blog.controller.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
public class HelloControllerTest {

    @Autowired
    private MockMvc mockMvc;

    // @Test
    // public void testIndex() throws Exception {
    // mockMvc.perform(MockMvcRequestBuilders.get("/"))
    // .andExpect(MockMvcResultMatchers.status().isOk());
    // }
}
