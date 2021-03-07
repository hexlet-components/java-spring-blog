build:
	./gradlew

test:
	./gradlew test

deps-update:
	./gradlew dependencyUpdates --refresh-dependencies -Drevision=release

check:
	./gradlew check

recompile-onfly:
	./gradlew --watch-fs processResources -t

boot-run:
	./gradlew bootRun

start:
	heroku local

.PHONY: build
