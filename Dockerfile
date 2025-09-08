FROM node:20.6.1 AS frontend

WORKDIR /frontend

COPY frontend/package*.json .

RUN npm ci

COPY frontend /frontend

RUN npm run build

FROM eclipse-temurin:21-jdk

RUN apt-get update && apt-get install -yq make unzip

WORKDIR /backend

COPY gradle gradle
COPY build.gradle.kts .
COPY settings.gradle.kts .
COPY gradlew .

RUN ./gradlew --no-daemon dependencies

COPY lombok.config .
COPY src src

COPY --from=frontend /frontend/dist /backend/src/main/resources/static

RUN ./gradlew --no-daemon build

ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=60.0 -XX:InitialRAMPercentage=50.0"
EXPOSE 8080

CMD java -jar build/libs/HexletSpringBlog-1.0-SNAPSHOT.jar
