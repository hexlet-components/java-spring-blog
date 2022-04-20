FROM gradle:7.2.0-jdk16

WORKDIR /app

COPY ./ .

RUN gradle installDist

CMD build/install/app/bin/app
