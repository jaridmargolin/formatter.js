MOCHA_OPTS= --check-leaks
REPORTER = progress

test: 
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS)
		
.PHONY: test