FROM eclipse-temurin:20-jdk

ARG GRADLE_VERSION=8.2

RUN apt-get update && apt-get install -yq make unzip

# RUN wget -q https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip \
#   && unzip gradle-${GRADLE_VERSION}-bin.zip \
#   && rm gradle-${GRADLE_VERSION}-bin.zip
#
# ENV GRADLE_HOME=/opt/gradle
#
# RUN mv gradle-${GRADLE_VERSION} ${GRADLE_HOME}

# ENV PATH=$PATH:$GRADLE_HOME/bin

WORKDIR /backend

COPY gradle gradle
COPY gradle.properties .
COPY build.gradle.kts .
COPY gradlew .

RUN ./gradlew --no-daemon dependencies

COPY . .

RUN ./gradlew --no-daemon build

CMD ./gradlew bootRun

# ENV GRADLE_USER_HOME /backend/.gradle/home
