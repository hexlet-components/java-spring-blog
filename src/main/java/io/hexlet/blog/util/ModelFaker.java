package io.hexlet.blog.util;

import static org.jeasy.random.FieldPredicates.named;

import org.jeasy.random.EasyRandom;
import org.jeasy.random.EasyRandomParameters;
import org.springframework.stereotype.Component;

@Component
public class ModelFaker {
    private EasyRandom easyRandom;

    public ModelFaker() {
        var parameters = new EasyRandomParameters().excludeField(named("id"));
        easyRandom = new EasyRandom(parameters);
    }
    public <T> T fake(Class<T> clazz) {
        return easyRandom.nextObject(clazz);
    }
}
