MOCHA_OPTS= --check-leaks
REPORTER = spec

default: test build lint

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS)

build:
	grunt uglify concat

lint:
	grunt jshint

.PHONY: test build build
