module.exports = {
    lambda: {
        type: 'stream',
        image: 'dev-center-gamma-depth',
        handler: 'index.handler',
    },
    infra: {
        mongo: {
            enabled: true,
        },
        redis: {
            enabled: true,
        },
    },
    source: {
        type: 'directory',
        options: {
            directory: {
                path: '../test-sources',
            },
        },
        collection: 'corva#wits',
    },
    event: {
        assetId: 1234,
        companyId: 1,
        appKey: 'big-data-energy.gamma-depth',
        sourceType: 'drilling',
    },
    debugOutput: 'file',
};
