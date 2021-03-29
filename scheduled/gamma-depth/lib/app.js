const DAL = require('./dal');
const Processor = require('./processor');
const { Corva } = require('@corva/node-sdk');

/**
 * App Initialization
 * 
 * @param {import('./src/node_modules/@corva/node-sdk').HandlerContext} context
 * @param {import('./src/node_modules/@corva/node-sdk').ScheduledLambdaEvent} event
 */
exports.handler = new Corva().scheduled(async (event, context) => {
    const dal = new DAL({
        apiClient: context.api,
        logger: context.logger,
        provider: context.config.provider,
    });

    const processor = new Processor({
        dal,
        logger: context.logger,
    });

    await processor.process({ event });
});
