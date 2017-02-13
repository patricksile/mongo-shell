ifdef GREP
	GREPARG = -g $(GREP)
endif

REPORTER ?= spec
UNIT_TESTS = ./test
NPM_BIN = ./node_modules/.bin
TIMEOUT = 30000

lint:
	$(NPM_BIN)/eslint lib test tools

coverage: lint
	$(NPM_BIN)/istanbul cover $(NPM_BIN)/_mocha -- --recursive -t $(TIMEOUT) --ui tdd $(TESTS)

test: lint
	$(NPM_BIN)/mocha --recursive --check-leaks --colors -t $(TIMEOUT) --reporter $(REPORTER) $(TESTS) $(GREPARG)

.PHONY: lint coverage test
