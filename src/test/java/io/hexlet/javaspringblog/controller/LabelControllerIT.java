package hexlet.code.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import hexlet.code.config.SpringConfigForIT;
import hexlet.code.dto.LabelDto;
import hexlet.code.model.Label;
import hexlet.code.repository.LabelRepository;
import hexlet.code.utils.TestUtils;
import java.util.List;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import static hexlet.code.config.SpringConfigForIT.TEST_PROFILE;
import static hexlet.code.controller.LabelController.ID;
import static hexlet.code.controller.LabelController.LABEL_CONTROLLER_PATH;
import static hexlet.code.utils.TestUtils.TEST_USERNAME;
import static hexlet.code.utils.TestUtils.asJson;
import static hexlet.code.utils.TestUtils.fromJson;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@ActiveProfiles(TEST_PROFILE)
@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = RANDOM_PORT, classes = SpringConfigForIT.class)
public class LabelControllerIT {

    @Autowired
    private TestUtils utils;

    @Autowired
    private LabelRepository labelRepository;

    @BeforeEach
    public void before() throws Exception {
        utils.regDefaultUser();
    }

    @AfterEach
    public void tearDown() {
        utils.tearDown();
    }

    @Test
    public void getAll() throws Exception {
        final var response = utils.perform(get(LABEL_CONTROLLER_PATH), TEST_USERNAME)
                .andExpect(status().isOk())
                .andReturn()
                .getResponse();

        final List<Label> labels = fromJson(response.getContentAsString(), new TypeReference<>() {
        });
        final List<Label> expected = labelRepository.findAll();
        Assertions.assertThat(labels)
                .containsAll(expected);
    }

    @Test
    public void createNewLabel() throws Exception {
        final LabelDto labelToSave = new LabelDto("test label");

        final var request = buildRequestForSave(labelToSave);

        final var response = utils.perform(request, TEST_USERNAME)
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse();

        final Label savedLabel = fromJson(response.getContentAsString(), new TypeReference<>() {
        });

        assertThat(labelRepository.getById(savedLabel.getId())).isNotNull();
    }

    @Disabled("For now active only positive tests")
    @Test
    public void createNewValidationFail() throws Exception {
        final LabelDto labelToSave = new LabelDto();

        final var request = buildRequestForSave(labelToSave);

        utils.perform(request, TEST_USERNAME)
                .andExpect(status().isUnprocessableEntity());
    }

    @Disabled("For now active only positive tests")
    @Test
    public void failToTwiceCreateSameLabel() throws Exception {
        final LabelDto labelToSave = new LabelDto("test label");

        final var request = buildRequestForSave(labelToSave);

        utils.perform(request, TEST_USERNAME)
                .andExpect(status().isCreated());
        utils.perform(request, TEST_USERNAME)
                .andExpect(status().isBadRequest());
    }

    @Test
    public void updateLabel() throws Exception {
        final LabelDto label = new LabelDto("test label");

        final var requestToSave = buildRequestForSave(label);

        final var response = utils.perform(requestToSave, TEST_USERNAME)
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse();

        final long id = fromJson(response.getContentAsString(), new TypeReference<Label>() {
        }).getId();

        label.setName("new name");
        final var requestToUpdate = put(LABEL_CONTROLLER_PATH + ID, id)
                .content(asJson(label))
                .contentType(APPLICATION_JSON);

        utils.perform(requestToUpdate, TEST_USERNAME)
                .andExpect(status().isOk());

        final Label updatedLabel = labelRepository.findById(id)
                .get();

        assertEquals(label.getName(), updatedLabel.getName());
    }

    @Disabled("For now active only positive tests")
    @Test
    public void updateLabelFails() throws Exception {
        final LabelDto label = new LabelDto("test label");

        final var requestToSave = buildRequestForSave(label);

        final var response = utils.perform(requestToSave, TEST_USERNAME)
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse();

        final long id = fromJson(response.getContentAsString(), new TypeReference<Label>() {
        }).getId();

        label.setName("");
        final var requestToUpdate = put(LABEL_CONTROLLER_PATH + ID, id)
                .content(asJson(label))
                .contentType(APPLICATION_JSON);

        utils.perform(requestToUpdate, TEST_USERNAME)
                .andExpect(status().isUnprocessableEntity());
    }

    @Test
    public void deleteLabel() throws Exception {
        final LabelDto label = new LabelDto("test label");

        final var requestToSave = buildRequestForSave(label);

        final var response = utils.perform(requestToSave, TEST_USERNAME)
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse();

        final long id = fromJson(response.getContentAsString(), new TypeReference<Label>() {
        }).getId();

        utils.perform(delete(LABEL_CONTROLLER_PATH + ID, id), TEST_USERNAME)
                .andExpect(status().isOk());

        assertFalse(labelRepository.existsById(id));
    }

    private MockHttpServletRequestBuilder buildRequestForSave(final LabelDto label) throws JsonProcessingException {
        return post(LABEL_CONTROLLER_PATH)
                .content(asJson(label))
                .contentType(APPLICATION_JSON);
    }

}
