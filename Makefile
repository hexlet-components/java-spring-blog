setup:
	./gradlew wrapper --gradle-version 9.2.1
	./gradlew build

app:
	./gradlew bootRun --args='--spring.profiles.active=dev'

frontend:
	make -C frontend start

backend: app

clean:
	./gradlew clean

build:
	./gradlew clean build

dev:
	mprocs

reload-classes:
	./gradlew -t classes

start-prod:
	./gradlew bootRun --args='--spring.profiles.active=prod'

install:
	./gradlew installDist

lint:
	./gradlew spotlessApply

test:
	./gradlew test

update-js-deps:
	cd frontend && npx ncu -u

.PHONY: setup app frontend backend clean build dev reload-classes start-prod install lint test update-js-deps
