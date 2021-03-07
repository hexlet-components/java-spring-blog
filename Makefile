build:
	./gradlew

check:
	./gradlew test

lint:
	./gradlew check

recompile-onfly:
	./gradlew --watch-fs processResources -t

boot-run:
	./gradlew bootRun

start:
	heroku local

.PHONY: build
