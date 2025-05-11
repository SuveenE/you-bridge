.PHONY: lint

lint:
	npx prettier --write .
	npm run lint --fix .
