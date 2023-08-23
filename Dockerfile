FROM node:20 AS frontend

WORKDIR /frontend

COPY frontend/package*.json .

RUN npm ci

COPY frontend /frontend

RUN npm run build

FROM eclipse-temurin:20-jdk

ARG GRADLE_VERSION=8.3

RUN apt-get update && apt-get install -yq make unzip

WORKDIR /backend

COPY gradle gradle
COPY gradle.properties .
COPY build.gradle.kts .
COPY settings.gradle.kts .
COPY gradlew .

RUN ./gradlew --no-daemon dependencies

COPY lombok.config .
COPY system.properties .
COPY src src

COPY --from=frontend /frontend/dist /backend/src/main/resources/static

RUN ./gradlew --no-daemon build

ENV JAVA_OPTS "-Xmx512M -Xms512M"
EXPOSE 8080

CMD java -jar build/libs/HexletSpringBlog-1.0-SNAPSHOT.jar
