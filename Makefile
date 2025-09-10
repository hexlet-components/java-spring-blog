setup:
	npm install
	./gradlew wrapper --gradle-version 9.0.0
	./gradlew build

frontend:
	make -C frontend start

backend:
	./gradlew bootRun --args='--spring.profiles.active=dev'

clean:
	./gradlew clean

build:
	./gradlew clean build

dev:
	heroku local

reload-classes:
	./gradlew -t classes

start-prod:
	./gradlew bootRun --args='--spring.profiles.active=prod'

install:
	./gradlew installDist

# start-dist:
# 	./build/install/app/bin/app

lint:
	./gradlew spotlessApply

test:
	./gradlew test

# report:
# 	./gradlew jacocoTestReport

update-js-deps:
	cd frontend && npx ncu -u

update-deps:
	./gradlew refreshVersions

# generate-migrations:
# 	gradle diffChangeLog

# db-migrate:
# 	./gradlew update


.PHONY: build frontend
