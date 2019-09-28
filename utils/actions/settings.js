const pfs = require('../functions/promise-fs');
const clients = require('./clients');
const { match } = require('../functions/match');

const keys = {
    defaultClient: "default-client",
    outputDir: "output-dir",
    storageDir: "storage-dir",
    noGit: "no-git",
};

const get = key => {
    const settings = require('../../settings.json');;
    if (key === undefined) return settings;
    if (key in settings) return settings[key];
    throw new Error(`Cannot get '${key}', can only get '${Object.keys(settings).join(`', '`)}'`);
};

const set = async (key, value) => match(key)
    .against({
        'undefined': () => {
            throw new Error(`Cannot set '${key}' to undefined, please enter a value`);
        },
        [keys.defaultClient]: match(value)
            .on(clients.get, () => {
                const oldSettings = get();
                const newSettings = { ...oldSettings, [key]: value };
                return pfs.writeFile(`${__dirname}/../../settings.json`, JSON.stringify(newSettings, null, 4))
            })
            .otherwise(() => {
                throw new Error(`Cannot set '${key}' to '${value}'`)
            }),
        [keys.outputDir]: () => {
            throw new Error(`Cannot set '${key}', can only set '${keys.defaultClient}'`);
        },
        [keys.storageDir]: () => {
            throw new Error(`Cannot set '${key}', can only set '${keys.defaultClient}'`);
        },
        [keys.noGit]: () => {
            throw new Error(`Cannot set '${key}', can only set '${keys.defaultClient}'`);
        },
    })
    .otherwise(() => {
        throw new Error(`Cannot set '${key}', can only set '${keys.defaultClient}'`);
    });


module.exports = {
    get,
    set,
};
