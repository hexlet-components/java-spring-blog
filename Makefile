build:
	./gradlew

test:
	./gradlew test

run:
	./gradlew --watch-fs --continuous bootRun

.PHONY: build
