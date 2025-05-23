import org.gradle.api.tasks.testing.logging.TestExceptionFormat
import org.gradle.api.tasks.testing.logging.TestLogEvent

plugins {
    application
    jacoco
    checkstyle
    alias(libs.plugins.lombok)
    alias(libs.plugins.versions)
    alias(libs.plugins.spotless)
    alias(libs.plugins.spring.boot)
    alias(libs.plugins.spring.dependency.management)
    alias(libs.plugins.shadow)
    alias(libs.plugins.sonarqube)
}

group = "io.hexlet.blog"
version = "1.0-SNAPSHOT"

application {
    mainClass.set("io.hexlet.blog.Application")
}

repositories {
    mavenCentral()
}

dependencies {
    // Spring Boot
    implementation(libs.springBootStarterWeb)
    implementation(libs.springBootStarterDataJpa)
    implementation(libs.springBootStarterValidation)
    implementation(libs.springBootStarterActuator)
    implementation(libs.springBootStarterSecurity)
    implementation(libs.springBootStarterOauth2ResourceServer)
    implementation(libs.springBootDevtools)
    implementation(libs.springBootConfigProcessor)

    // OpenAPI
    implementation(libs.springdocOpenapiUi)

    // Utilities
    implementation(libs.jacksonDatabindNullable)
    implementation(libs.commonsLang3)
    implementation(libs.datafaker)
    implementation(libs.instancioJunit)
    implementation(libs.jsonunitAssertj)

    // MapStruct
    implementation(libs.mapstruct)
    annotationProcessor(libs.mapstructProcessor)

    // DB
    runtimeOnly(libs.h2)

    // Tests
    testImplementation(libs.springBootStarterTest)
    testImplementation(libs.springSecurityTest)
    testImplementation(platform(libs.junitBom))
    testImplementation(libs.junitJupiter)
    testRuntimeOnly(libs.junitPlatformLauncher)
}

tasks.test {
    useJUnitPlatform()
    testLogging {
        exceptionFormat = TestExceptionFormat.FULL
        events = setOf(
            TestLogEvent.FAILED,
            TestLogEvent.PASSED,
            TestLogEvent.SKIPPED
        )
        showStandardStreams = true
    }
}

tasks.jacocoTestReport {
    reports {
        xml.required.set(true)
    }
}

spotless {
    java {
        importOrder()
        removeUnusedImports()
        eclipse().sortMembersEnabled(true)
        formatAnnotations()
        indentWithSpaces(4)
    }
}

sonar {
    properties {
        property("sonar.projectKey", "hexlet-boilerplates_java-package")
        property("sonar.organization", "hexlet-boilerplates")
        property("sonar.host.url", "https://sonarcloud.io")
    }
}

