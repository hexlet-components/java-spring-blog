import org.gradle.api.tasks.testing.logging.TestExceptionFormat
import org.gradle.api.tasks.testing.logging.TestLogEvent

plugins {
  application
  // "checkstyle"
  id("io.freefair.lombok") version "8.2.2"
  id("org.springframework.boot") version "3.1.3"
  id("io.spring.dependency-management") version "1.1.3"
  id("com.github.ben-manes.versions") version "0.47.0"
}

group = "io.hexlet.blog"
version = "1.0-SNAPSHOT"

application { mainClass.set("io.hexlet.blog.Application") }

repositories { mavenCentral() }

dependencies {
  implementation("org.springframework.boot:spring-boot-starter-web")
  implementation("org.springframework.boot:spring-boot-starter-data-jpa")
  implementation("org.springframework.boot:spring-boot-starter-validation")
  implementation("org.springframework.boot:spring-boot-devtools")
  implementation("org.springframework.boot:spring-boot-starter-actuator")
  implementation("org.springframework.boot:spring-boot-configuration-processor")
  implementation("org.springframework.boot:spring-boot-starter-security")
  implementation("org.springframework.boot:spring-boot-starter-oauth2-resource-server")

  implementation("org.springframework.security:spring-security-test")
  implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.2.0")

  implementation("org.modelmapper:modelmapper:3.1.1")

  implementation("org.instancio:instancio-junit:3.2.0")
  implementation("net.datafaker:datafaker:2.0.1")

  implementation("io.sentry:sentry-spring-boot-starter-jakarta:6.28.0")
  runtimeOnly("com.h2database:h2")
  testImplementation("org.springframework.boot:spring-boot-starter-test")
  testImplementation(platform("org.junit:junit-bom"))
  testImplementation("org.junit.jupiter:junit-jupiter")

}

tasks.test {
  useJUnitPlatform()
  // https://technology.lastminute.com/junit5-kotlin-and-gradle-dsl/
  testLogging {
    exceptionFormat = TestExceptionFormat.FULL
    events = mutableSetOf(TestLogEvent.FAILED, TestLogEvent.PASSED, TestLogEvent.SKIPPED)
    // showStackTraces = true
    // showCauses = true
    showStandardStreams = true
  }
}
