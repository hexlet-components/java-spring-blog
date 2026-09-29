FROM node:26-slim AS frontend

# corepack из образов Node 26 убран, поэтому pnpm ставится напрямую. Версия
# берётся из поля packageManager, чтобы образ и разработка совпадали.
RUN npm install -g pnpm@12.6.0

WORKDIR /frontend

COPY frontend/package.json frontend/pnpm-lock.yaml frontend/pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY frontend /frontend

RUN pnpm run build

FROM eclipse-temurin:25-jdk

RUN apt-get update && apt-get install -yq make unzip

WORKDIR /backend

COPY gradle gradle
COPY gradle.properties .
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
