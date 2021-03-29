const { ACTUAL_GAMMA_DEPTH_COLLECTION } = require('./constants');

const equals = (a, b) => a === b;
const uniq = (v, i, a) => equals(a.indexOf(v), i);

class Processor {
    /**
     * Main Application Logic
     * 
     * @param {{dal: DAL, logger: logger: import('@corva/node-sdk').HandlerContext['logger']}} param0
     */
    constructor({ dal, logger }) {
        this.dal = dal;
        this.logger = logger;
    }

    /**
     * 
     * @param {{event: {import('@corva/node-sdk').StreamLambdaEvent} }} param0 
     */
    async process({ event }) {
        // Fetch WITS records from the API
        const witsRecords = await this.dal.fetchWitsRecords({ event });

        // Collect all unique drillstring ids from the WITS records
        const entriesWithDrillStrings = witsRecords.filter((witsRecord) =>
            Boolean(witsRecord.metadata.drillstring)
        );
        const drillstringIds = entriesWithDrillStrings
            .map((wits) => wits.metadata.drillstring)
            .filter(uniq);

        // Return early if records were not tagged with a drillstring id
        if (!drillstringIds.length) {
            return;
        }

        // Fetch drillstrings from the API
        const drillstrings = await this.dal.fetchDrillstrings({ assetId: event.asset_id, drillstringIds })

        // Build actual gamma depth record for each incoming record
        const actualGammaDepths = entriesWithDrillStrings.map((witsRecord) => {
            // Destructure object
            const {
                data: { bit_depth, gamma_ray },
                metadata: { drillstring },
                timestamp,
                company_id,
            } = witsRecord;

            // Find matching drillstring
            const {
                data: { components },
            } = drillstrings.find(({ _id }) => equals(_id, drillstring));

            // Find MWD component with a gamma sensor from the drillstring
            const component = components.find(
                (component) =>
                    equals(component.family, 'mwd') && equals(component.has_gamma_sensor, true)
            );

            // Return actual gamma depth object
            return {
                asset_id: assetId,
                timestamp,
                collection: ACTUAL_GAMMA_DEPTH_COLLECTION,
                provider: this.provider,
                version: 1,
                company_id,
                data: {
                    gamma_depth: component
                        ? bit_depth - component.gamma_sensor_to_bit_distance
                        : bit_depth,
                    bit_depth,
                    gamma_ray,
                },
            };
        });

        this.logger.info(`Calculated ${actualGammaDepths.length} records`);

        // Post actual gamma depth records to the API
        await this.dal.saveActualGammaDepthRecords({ actualGammaDepths });
    }
}

module.exports = Processor;
