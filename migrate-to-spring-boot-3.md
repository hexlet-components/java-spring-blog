# Мигрируем на Spring Boot 3

Spring Boot 3 использует спецификации Servlet 5.0 and JPA 3.0, Hibernate 6 и Tomcat 10

## Обновление версии JDK и Gradle

Spring boot 3 поддерживает версию JDK не ниже 17 и Gradle не ниже 7.3. Если вы используете версии ниже, обновите их

## Обновление зависимостей проекта

### Обновление зависимостей Spring Boot

- Обновите плагин 'org.springframework.boot' до последней достуной версии

```groovy
id 'org.springframework.boot' version '3.0.7'
```

- Используйте менеджер зависимостей *io.spring.dependency-management*, чтобы установить актуальные версии компонентов *org.springframework.boot*

```groovy
implementation(
        'org.springframework.boot:spring-boot-starter-data-jpa',
        'org.springframework.boot:spring-boot-starter-web',
        'org.springframework.boot:spring-boot-starter-actuator',
        'org.springframework.boot:spring-boot-starter-validation',
        'org.springframework.boot:spring-boot-starter-security',
)

testImplementation(
        'org.springframework.boot:spring-boot-starter-security',
        'org.springframework.security:spring-security-test',
        'org.springframework.boot:spring-boot-starter-test',
)
```


### Обновление зависимостей и настройка Liquibase

- Установите плагин Liquibase последней доступной версии

```groovy
id 'org.liquibase.gradle' version '2.2.0'
```

- Используйте менеджер зависимостей для установки актуальной версии liquibase core

```groovy
implementation(
            'org.liquibase:liquibase-core',
    )
```

- Настраиваем Liquibase. 

```groovy
// В новой версии изменилось название таски gradle.
// Теперь она называется *diffChangelog*, а старое именование *diffChangeLog* считается устаревшим
diffChangelog {
    dependsOn compileJava
}

liquibase {
    activities {
        main {
            // Изменилось имя свойства, которое указывает путь к файлу
            // Формат xml для changelog файла тоже признан устаревшим
            // По умолчанию предлагается использовать имя файла db.changelog-master.yaml
            changelogFile 'src/main/resources/db/changelog/db.changelog-master.yaml'
            url 'jdbc:h2:./taskManager'
            // Теперь не требуется указывать имя и пароль для подключения к БД
            referenceUrl 'hibernate:spring:io.hexlet.javaspringblog.model.' +
                        // Указываем диалект
                        '?dialect=org.hibernate.dialect.H2Dialect' +
                        // Изменилось стратегия именования
                        // По умолчанию теперь используется CamelCaseToUnderscoresNamingStrategy
                        '&hibernate.physical_naming_strategy=org.hibernate.boot.model.naming.CamelCaseToUnderscoresNamingStrategy'
        }
    }
}
```

- ### Обновление зависимостей QuryDsl

Эти зависимости понадобятся для работы с предикатами при фильтации задач. Spring boot 3 использует Jakarta EE API вместо Java EE. Поэтому у зависимостей появлется классификатор *jakarta*

```groovy
implementation(
            'com.querydsl:querydsl-jpa:5.0.0:jakarta',
    )

annotationProcessor(
            'com.querydsl:querydsl-apt:5.0.0:jakarta',
            'jakarta.persistence:jakarta.persistence-api:3.1.0'
    )
```


## Обновление пакетов в коде

Все зависимости с неймспейсом *javax* меняются на *jakarta*

```text
javax.persistence.*   -> jakarta.persistence.*

javax.validation.*    -> jakarta.validation.*

javax.servlet.*       -> jakarta.servlet.*

javax.annotation.*    -> jakarta.annotation.*
```


## Обновление настроек Spring Security

Spring boot 3 использует компонент Spring Security 6. Обновите настройки безопасности

- Аннотация `@EnableGlobalMethodSecurity` теперь считается устаревшой и заменяется на `@EnableMethodSecurity`
- Интерфейс `WebSecurityConfigurerAdapter` с методом `configure()` теперь считается устаревшим. Вместо него теперь используется класс `SecurityFilterChain`

```java
@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests((requests) -> requests
                        .requestMatchers("/", "/home").permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin((form) -> form
                        .loginPage("/login")
                        .permitAll()
                )
                .logout((logout) -> logout.permitAll());

        return http.build();
    }
}
```