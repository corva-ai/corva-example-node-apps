# Dev Center Formation Evaluation Importer Task Application

This is a sample application for Corva Dev Center.

Corva apps are serverless applications that run in AWS Lambda. AWS Lambda Getting Started: https://aws.amazon.com/lambda/getting-started/

Type: Task

## Contents

* index.js
    * Lambda handler file
* lib
    * app source code
* patches
    * patch for las-js library
* manifest.json
    * manifest file that defines the app settings in Corva

## Prerequisites

- OS X or Linux-based system is preferred (not required)
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
