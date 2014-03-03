test:
	@NODE_ENV=test grunt uglify concat && \
	grunt jshint && \
	./node_modules/.bin/mocha --reporter spec --check-leaks

.PHONY: test