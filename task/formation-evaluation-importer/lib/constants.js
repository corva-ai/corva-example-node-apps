function reverseMap(data) {
    return Object.entries(data).reduce((res, [key, values]) => {
        values.forEach((value) => {
            res[value.toLowerCase()] = key;
        });
        return res;
    }, {});
}

const CHUNK_SIZE = 667;

const UNITS = {
    'ft': ['f', 'ft', `'`, 'feet'],
    'm': ['m', 'm.', 'meter', 'meters'],
    'in': ['in', 'inch', 'inches', '"', 'ins', 'inus'],
    'mm': ['mm'],
    'ohmm': ['ohmm', 'ohm.m', 'ohm-'],
    'gAPI': ['gapi'],
    'ft3/ft3': ['cfcf'],
    'pu': ['pu'],
    'lbf': ['lbf'], // force
    'C': ['degc'],
    'F': ['degf'],
    'K': ['degk'],
    'mD': ['md'],
    'g/cm3': ['g/c3', 'g/cc', 'g/cm3'],
    'g/m3': ['gm/3', 'gm/c'],
    'lbm/gal': ['ppg', 'lb/g', 'lbm/gal'],
    'ppm': ['ppm'],
    'mV': ['mv'],
    'ft/s': ['ft/s'],
    'm/s': ['m/s'],
    'kPa': ['kPa'],
    'psi': ['psi'],
    'bar': ['bar'],
    'us/ft': ['us/f', 'us/ft'],
    'us/m': ['us/m'],
    '': ['none'],
};

exports.UNITS = UNITS;

exports.MNEMONICS = {
    md: ['dept', 'depth'],
};

exports.BUCKETS = {
    'Length': [...UNITS.m, ...UNITS.ft],
    'Gamma': [...UNITS.gAPI],
    'Resistivity': [...UNITS.ohmm],
    'Density': [...UNITS['g/cm3'], ...UNITS['g/m3'], ...UNITS['lbm/gal']],
    'Porosity': [...UNITS['ft3/ft3'], ...UNITS.pu],
    'Permiability': [...UNITS.mD],
    'Acoustic Slowness': [...UNITS['us/ft'], ...UNITS['us/m']],
    'Temperature': [...UNITS.C, ...UNITS.F, ...UNITS.K],
    'Short Length': [...UNITS.mm, ...UNITS.in],
    'SP (Spontaneous Potential)': [...UNITS.mV],
    'Concentration': [...UNITS.ppm],
    'Velocity': [...UNITS['m/s'], ...UNITS['ft/s']],
    'Pressure': [...UNITS.kPa, ...UNITS.bar, ...UNITS.psi],
    'Other': ['*'],
};

exports.UNIT_MAP = reverseMap(exports.UNITS);

exports.BUCKET_MAP = reverseMap(exports.BUCKETS);

exports.MNEMONIC_MAP = reverseMap(exports.MNEMONICS);

exports.CHUNK_SIZE = CHUNK_SIZE;

exports.FORMATION_EVALUATION_COLLECTION =  'formation-evaluation';
