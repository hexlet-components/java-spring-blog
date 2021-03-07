build:
	./gradlew

test:
	./gradlew test

check:
	./gradlew check

recompile-onfly:
	./gradlew --watch-fs processResources -t

boot-run:
	./gradlew bootRun

start:
	heroku local

.PHONY: build
