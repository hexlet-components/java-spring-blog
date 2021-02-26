build:
	./gradlew

test:
	./gradlew test

recompile-onfly:
	./gradlew --watch-fs processResources -t

boot-run:
	./gradlew bootRun

start:
	heroku local

.PHONY: build
