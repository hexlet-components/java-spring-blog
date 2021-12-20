package hexlet.code.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import hexlet.code.config.SpringConfigForIT;
import hexlet.code.dto.TaskStatusDto;
import hexlet.code.model.TaskStatus;
import hexlet.code.repository.TaskStatusRepository;
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
import static hexlet.code.controller.TaskStatusController.ID;
import static hexlet.code.controller.TaskStatusController.TASK_STATUS_CONTROLLER_PATH;
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
public class TaskStatusControllerIT {

    @Autowired
    private TestUtils utils;

    @Autowired
    private TaskStatusRepository taskStatusRepository;

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
        final var response = utils.perform(get(TASK_STATUS_CONTROLLER_PATH), TEST_USERNAME)
                .andExpect(status().isOk())
                .andReturn()
                .getResponse();

        final List<TaskStatus> taskStatuses = fromJson(response.getContentAsString(), new TypeReference<>() {
        });
        final List<TaskStatus> expected = taskStatusRepository.findAll();
        Assertions.assertThat(taskStatuses)
                .containsAll(expected);
    }

    @Test
    public void createNewState() throws Exception {
        final TaskStatusDto stateToSave = new TaskStatusDto("test state");

        final var request = buildRequestForSave(stateToSave);

        final var response = utils.perform(request, TEST_USERNAME)
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse();

        final TaskStatus savedTaskStatus = fromJson(response.getContentAsString(), new TypeReference<>() {
        });

        assertThat(taskStatusRepository.getById(savedTaskStatus.getId())).isNotNull();
    }

    @Disabled("For now active only positive tests")
    @Test
    public void createNewValidationFail() throws Exception {
        final TaskStatusDto stateToSave = new TaskStatusDto();

        final var request = buildRequestForSave(stateToSave);

        utils.perform(request, TEST_USERNAME)
                .andExpect(status().isUnprocessableEntity());
    }

    @Disabled("For now active only positive tests")
    @Test
    public void failToTwiceCreateSameState() throws Exception {
        final TaskStatusDto stateToSave = new TaskStatusDto("test state");

        final var request = buildRequestForSave(stateToSave);

        utils.perform(request, TEST_USERNAME)
                .andExpect(status().isCreated());
        utils.perform(request, TEST_USERNAME)
                .andExpect(status().isBadRequest());
    }

    @Test
    public void updateState() throws Exception {
        final TaskStatusDto state = new TaskStatusDto("test state");

        final var requestToSave = buildRequestForSave(state);

        final var response = utils.perform(requestToSave, TEST_USERNAME)
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse();

        final long id = fromJson(response.getContentAsString(), new TypeReference<TaskStatus>() {
        }).getId();

        state.setName("new name");
        final var requestToUpdate = put(TASK_STATUS_CONTROLLER_PATH + ID, id)
                .content(asJson(state))
                .contentType(APPLICATION_JSON);

        utils.perform(requestToUpdate, TEST_USERNAME)
                .andExpect(status().isOk());

        final TaskStatus updatedTaskStatus = taskStatusRepository.findById(id)
                .get();

        assertEquals(state.getName(), updatedTaskStatus.getName());
    }

    @Disabled("For now active only positive tests")
    @Test
    public void updateStateFails() throws Exception {
        final TaskStatusDto state = new TaskStatusDto("test state");

        final var requestToSave = buildRequestForSave(state);

        final var response = utils.perform(requestToSave, TEST_USERNAME)
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse();

        final long id = fromJson(response.getContentAsString(), new TypeReference<TaskStatus>() {
        }).getId();

        state.setName("");
        final var requestToUpdate = put(TASK_STATUS_CONTROLLER_PATH + ID, id)
                .content(asJson(state))
                .contentType(APPLICATION_JSON);

        utils.perform(requestToUpdate, TEST_USERNAME)
                .andExpect(status().isUnprocessableEntity());
    }

    @Test
    public void deleteState() throws Exception {
        final TaskStatusDto state = new TaskStatusDto("test state");

        final var requestToSave = buildRequestForSave(state);

        final var response = utils.perform(requestToSave, TEST_USERNAME)
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse();

        final long id = fromJson(response.getContentAsString(), new TypeReference<TaskStatus>() {
        }).getId();

        utils.perform(delete(TASK_STATUS_CONTROLLER_PATH + ID, id), TEST_USERNAME)
                .andExpect(status().isOk());

        assertFalse(taskStatusRepository.existsById(id));
    }

    private MockHttpServletRequestBuilder buildRequestForSave(
            final TaskStatusDto state
    ) throws JsonProcessingException {
        return post(TASK_STATUS_CONTROLLER_PATH)
                .content(asJson(state))
                .contentType(APPLICATION_JSON);
    }

}
