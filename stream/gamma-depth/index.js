const { handler } = require('./lib/app');

/**
 * AWS Lambda Handler Function
 *
 * @param {any} event
 * @param {import('aws-lambda').Context} context
 */
async function lambdaHandler(event, context) {
    context.callbackWaitsForEmptyEventLoop = false;
    await handler(event, context);
}

exports.handler = lambdaHandler;
