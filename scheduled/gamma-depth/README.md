# Dev Center Gamma Depth Scheduled Application

This is a sample application for Corva Dev Center.

Corva apps are serverless applications that run in AWS Lambda. AWS Lambda Getting Started: https://aws.amazon.com/lambda/getting-started/

Type: Scheduled

## Contents

* index.js
    * Lambda handler file
* lib
    * app source code
* manifest.json
    * manifest file that defines the app settings in Corva
* .corvarc.js
    * configurations for the Local Testing Framework
* Dockerfile
    * Dockerfile for the Local Testing Framework
* test-sources
    * source data for the Local Testing Framework

## Prerequisites

- OS X or Linux-based system is preferred (not required)
- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed
- [Node.js with NPM](https://nodejs.org/en/) installed (via [nvm](https://github.com/nvm-sh/nvm))

## How to use

1. Install Dependencies

```
npm install
```

2. Run Tests

```
npm test
```

## Deployment

Run `npm run bundle` to create a zip package that can be uploaded to Dev Center.

## Testing using Local Testing Framework

1. Install Corva Local Testing Framework

Local Testing Framework simulates Corva environment by generating events from the given dataset. Datasets located in `test-sources` are loaded automatically.

```
npm i -g @corva/local-testing-framework
```

2. Build the application (from the repository root)

```
docker build -f Dockerfile -t dev-center-gamma-depth-scheduled .
```

3. Run application using Local Testing Framework

```
corva local
```

Logs are written to `output/dev-center-gamma-depth-scheduled_*.log` file.

