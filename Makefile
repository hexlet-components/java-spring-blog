build:
	./gradlew

# Run single test
# ./gradlew test --continuous --tests "*HomeControllerTests"
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

db-migrate:
	./gradlew update

gradle-upgrade:
	./gradlew wrapper --gradle-version 6.8.3

.PHONY: build
