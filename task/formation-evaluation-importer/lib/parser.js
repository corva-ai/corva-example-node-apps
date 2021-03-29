const { BUCKET_MAP, MNEMONICS, MNEMONIC_MAP, UNIT_MAP } = require('./constants');
const { Las } = require('las-js');

function mapMetaData([mnemonic, data]) {
    const mappedUnit = UNIT_MAP[data.unit.toLowerCase()];
    const unit = typeof mappedUnit === 'undefined' ? data.unit : mappedUnit;
    const bucket = BUCKET_MAP[data.unit.toLowerCase()] || BUCKET_MAP['*'];
    return {
        data: { mnemonic, ...data },
        mapping: { mnemonic: MNEMONIC_MAP[mnemonic.toLowerCase()] || mnemonic, unit, bucket },
    };
}

async function parse(lasData) {
    const las = new Las(lasData, { loadFile: false });
    const [headers, data, well, curve, params, other] = await Promise.all([
        las.header(),
        las.data(),
        las
            .wellParams()
            .then((data) => {
                return { data: Object.entries(data).map(mapMetaData) };
            })
            .catch((error) => {
                return { error };
            }),
        las.curveParams().then((data) => {
            return { data: Object.entries(data).map(mapMetaData) };
        }),
        las
            .logParams()
            .then((data) => {
                return { data: Object.entries(data).map(mapMetaData) };
            })
            .catch((error) => {
                return { error };
            }),
        las
            .other()
            .then((data) => {
                return { data };
            })
            .catch((error) => {
                return { error };
            }),
    ]);

    // validation
    if (!MNEMONICS.md.includes(headers[0].toLowerCase())) {
        throw new Error('Measured depth should be first column');
    }

    const mappedData = data.map((row) => {
        return row.reduce((res, value, index) => {
            const key = headers[index];
            const mappedKey = MNEMONIC_MAP[key.toLowerCase()] || key;
            res[mappedKey] = value;
            return res;
        }, {});
    });

    return {
        well,
        curve,
        params,
        other,
        data: mappedData,
    };
}

module.exports = parse;
