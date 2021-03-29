class DAL {
    /**
     *
     * @param {{
     *  apiClient: import('@corva/node-sdk').HandlerContext['api'],
     *  provider: string,
     *  logger: import('@corva/node-sdk').HandlerContext['logger'],
     * }} param0
     */
    constructor({ apiClient, provider, logger }) {
        this.apiClient = apiClient;
        this.provider = provider;
        this.logger = logger;
    }

    /**
     *
     * @param {string} fileUrl
     * @returns string
     */
    async getFile(fileUrl) {
        // TODO: check if @corva/node-sdk allows to make direct requests to any url
        const [prefixUrl, ...rest] = fileUrl.split('/');

        const file = await this.apiClient.request(rest.join('/'), {
            prefixUrl,
            responseType: 'text',
        });

        return file.body;
    }

    async saveData({ data, collection }) {
        if (!data) {
            throw new Error('Empty data specified.');
        }
        try {
            const resp = await this.apiClient.request(`v1/data/${this.provider}/${collection}`, {
                method: 'POST',
                json: data,
            });

            if (![200, 201].includes(resp.statusCode)) {
                throw new Error(`Save data failed with ${resp.statusMessage || resp.statusCode}.`);
            }
            return resp.body;
        } catch (err) {
            this.logger.error(err);
            const error = new Error(`Failed to save data`);
            throw error;
        }
    }

    async deleteDataByFilename({ assetId, file, collection }) {
        const metaCollection = `${collection}.metadata`;
        const dataCollection = `${collection}.data`;

        const metaConditions = [`{asset_id#eq#${assetId}}`, `{file#eq#'${file}'}`];
        const dataConditions = [`{asset_id#eq#${assetId}}`, `{metadata.file#eq#'${file}'}`];

        try {
            // delete data first
            await this.apiClient.request(`v1/data/${this.provider}/${dataCollection}`, {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                },
                searchParams: {
                    asset_id: assetId,
                    query: `${dataConditions.join('AND')}`,
                },
            });
            // delete metadata only on data delete sucess
            await this.apiClient.request(`v1/data/${this.provider}/${metaCollection}`, {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                },
                searchParams: {
                    asset_id: assetId,
                    query: `${metaConditions.join('AND')}`,
                },
            });
        } catch (err) {
            this.logger.error(err);
            const error = new Error(`Failed to delete file ${file} for ${assetId}`);
            throw error;
        }
    }
}

module.exports = DAL;
