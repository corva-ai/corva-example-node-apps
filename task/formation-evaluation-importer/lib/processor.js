const { CHUNK_SIZE, FORMATION_EVALUATION_COLLECTION } = require('./constants');
const { chunk } = require('./utils');

class Processor {
    /**
     *
     * @param {{config: import('@corva/node-sdk').AppConfig, dal: import('./dal')} param0
     */
    constructor({ dal, logger, parser, config }) {
        this.dal = dal;
        this.logger = logger;
        this.parser = parser;
        this.config = config;
    }

    async process({ event }) {
        const { asset_id: assetId, company_id: companyId } = event;
        const { file_name: fileName, file_url: fileUrl } = event.properties;
        const file = fileName.split('/').pop();

        try {
            await this.dal.deleteDataByFilename({
                file,
                assetId,
                collection: FORMATION_EVALUATION_COLLECTION,
            });
        } catch (err) {
            if (!err.response || err.response.statusCode !== 404) {
                this.logger.error(err, `Failed to delete old data from file ${file}`);
            }
        }

        const dataFile = await this.dal.getFile(fileUrl);

        const las = await this.parser.parse(dataFile);

        const { data, curve, params, well, other } = las;
        const timestamp = Math.round(new Date().getTime() / 1000);

        const metadata = {
            asset_id: assetId,
            timestamp,
            company_id: companyId,
            collection: `${FORMATION_EVALUATION_COLLECTION}.metadata`,
            app: this.config.name,
            provider: this.config.provider,
            data: {
                params,
                well,
                curve,
                other,
            },
            file,
            records_count: data.length,
            version: 1,
        };

        const savedMeta = await this.dal.saveData({
            data: metadata,
            collection: metadata.collection,
        });

        const result = data.map((it) => {
            return {
                asset_id: assetId,
                timestamp,
                company_id: companyId,
                collection: `${FORMATION_EVALUATION_COLLECTION}.data`,
                app: this.config.name,
                provider: this.config.provider,
                metadata: {
                    formation_evaluation_id: savedMeta._id,
                    file,
                },
                data: it,
                version: 1,
            };
        });

        await Promise.all(
            chunk(result, CHUNK_SIZE).map((partialResults) => {
                return this.dal.saveData({
                    data: partialResults,
                    collection: `${FORMATION_EVALUATION_COLLECTION}.data`,
                });
            })
        );
    }
}

module.exports = Processor;
