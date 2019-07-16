# Copies in our code and runs NPM Install
FROM node:latest AS base
WORKDIR /usr/src/app
COPY ./ .
RUN ["npm", "ci"]

# Lints Code
FROM base AS linting
WORKDIR /usr/src/app
COPY --from=base /usr/src/app/ .
RUN ["npm", "run", "lint"]

# Gets Sonarqube Scanner from Dockerhub and runs it
FROM newtmitch/sonar-scanner:latest AS sonarqube
COPY --from=base /usr/src/app /usr/src
CMD ["sonar-scanner -Dsonar.projectBaseDir=/usr/src"]

# Runs Unit Tests
FROM base AS unit-tests
WORKDIR /usr/src/app
COPY --from=base /usr/src/app/ .
RUN ["npm", "run", "test"]

# Starts and Serves Web Page
FROM node:latest
WORKDIR /usr/src/app
COPY --from=base /usr/src/app .
CMD node start.js
