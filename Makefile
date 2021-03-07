build:
	./gradlew

test:
	./gradlew test

clean:
	./gradlew clean

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

db-diff-changelog:
	./gradlew diffChangeLog

.PHONY: build
