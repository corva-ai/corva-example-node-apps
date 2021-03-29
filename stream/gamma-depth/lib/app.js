const DAL = require('./dal');
const { Corva } = require('@corva/node-sdk');
const Processor = require('./lib/processor');

/**
 * App Initialization
 * 
 * @param {import('@corva/node-sdk').StreamLambdaEvent} event
 * @param {import('@corva/node-sdk/lib/cache/stateful-context').StatefulContext} context
 */
exports.handler = new Corva().stream(async (event, context) => {
    const dal = new DAL({
        apiClient: context.api,
        logger: context.logger,
        provider: context.config.provider,
    });

    const processor = new Processor({
        dal,
        logger: context.logger,
    });

    await processor.process(event.asset_id, event.records);
});
