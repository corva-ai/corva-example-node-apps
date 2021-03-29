const {
    ACTUAL_GAMMA_DEPTH_COLLECTION,
    CORVA_PROVIDER,
    DRILLSTRINGS_COLLECTION,
    PROVIDER,
    WITS_COLLECTION,
} = require('./constants');

class DAL {
    /**
     * Data Access Layer
     * 
     * @param {{
     *  apiClient: import('@corva/node-sdk').HandlerContext['api'],
     *  provider: string,
     *  collection: string,
     *  logger: import('@corva/node-sdk').HandlerContext['logger'],
     * }} param0
     */
    constructor({ apiClient, provider, logger }) {
        this.apiClient = apiClient;
        this.provider = provider;
        this.logger = logger;
    }

    async fetchWitsRecords({ event }) {
        const queryTo = Math.floor(event.schedule_start / 1000);
        const query = {
            'asset_id': event.asset_id,
            'timestamp': {
                $gt: queryTo - event.interval,
                $lte: queryTo,
            },
            'metadata.drillstring': { $exists: true, $ne: null },
        };
    
        return this.apiClient
            .request(`api/v1/data/${CORVA_PROVIDER}/${WITS_COLLECTION}/`, {
                searchParams: {
                    query: JSON.stringify(query),
                    sort: JSON.stringify({ timestamp: 1 }),
                    limit: 1000,
                },
            })
            .then(this._handleApiError);
    };

    async fetchDrillstrings({ assetId, drillstringIds }) {
        const drillstringQuery = {
            asset_id: assetId,
            _id: { $in: drillstringIds },
        };

        return await this.apiClient
            .request(`api/v1/data/${CORVA_PROVIDER}/${DRILLSTRINGS_COLLECTION}/`, {
                searchParams: {
                    query: JSON.stringify(drillstringQuery),
                    sort: JSON.stringify({ timestamp: 1 }),
                    limit: 100,
                },
            })
            .then(this._handleApiError);
    }

    async saveActualGammaDepthRecords({ actualGammaDepths }) {
        await this.apiClient
            .request(`api/v1/data/${PROVIDER}/${ACTUAL_GAMMA_DEPTH_COLLECTION}/`, {
                method: 'POST',
                json: actualGammaDepths,
            })
            .then(this._handleApiError);
    }

    async _handleApiError(res) {
        if ([200, 201].includes(res.statusCode)) {
            return res.body;
        }

        throw new Error(`API request failed: ${res.statusCode}`);
    }
}

module.exports = DAL;
