FROM node:23 AS frontend

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
COPY config config

COPY --from=frontend /frontend/dist /backend/src/main/resources/static

RUN ./gradlew --no-daemon build

ENV JAVA_OPTS="-Xmx512M -Xms512M"
EXPOSE 8080

CMD ["java", "-jar", "build/libs/HexletSpringBlog-1.0-SNAPSHOT.jar"]
