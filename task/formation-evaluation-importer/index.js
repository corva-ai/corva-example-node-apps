const { Corva } = require('./lib/node_modules/@corva/node-sdk');
const DAL = require('./lib/dal');
const Processor = require('./lib/processor');
const parse = require('./lib/parser');

exports.handler = new Corva().task((event, context) => {
    const dal = new DAL({
        apiClient: context.api,
        logger: context.logger,
        provider: context.config.provider,
    });

    const processor = new Processor({
        dal,
        logger: context.logger,
        parser: { parse },
        config: context.config,
    });

    return processor.process({ event });
});
