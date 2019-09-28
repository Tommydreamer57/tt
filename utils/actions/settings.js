const pfs = require('../functions/promise-fs');
const clients = require('./clients');
const { match, matchAsync } = require('../functions/match');

const keys = {
    defaultClient: "default-client",
    outputDir: "output-dir",
    storageDir: "storage-dir",
    noGit: "no-git",
};

const write = settings => pfs.writeFile(`${__dirname}/../../settings.json`, JSON.stringify(settings, null, 4));

const get = async key => {
    const settings = await pfs.readJSON(`${__dirname}/../../settings.json`);
    if (key === undefined) return settings;
    if (key in settings) return settings[key];
    throw new Error(`Cannot get '${key}', can only get '${Object.keys(settings).join(`', '`)}'`);
};

const set = (key, value) => match(key)
    .against({
        'undefined': () => {
            throw new Error(`Cannot set '${key}' to undefined, please enter a value`);
        },
        [keys.defaultClient]: async () => {
            const client = await clients.get(value);
            if (!client) throw new Error(`Cannot set '${key}' to '${value}'`)
            const oldSettings = await get();
            const newSettings = { ...oldSettings, [key]: value };
            return write(newSettings);
        },
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
