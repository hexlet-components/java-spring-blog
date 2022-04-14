FROM gradle:7.2.0-jdk16

WORKDIR /app

COPY ./ .

RUN ./gradlew update

CMD ["./gradlew", "bootRun", "--args='--spring.profiles.active=prod'"]

EXPOSE $PORT