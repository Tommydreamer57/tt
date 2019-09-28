const pfs = require('../functions/promise-fs');
const removeNullValues = require('../functions/remove-null-values');

const write = clients => pfs.writeFile(`${__dirname}/../../clients.json`, JSON.stringify(clients, null, 4));

const writeDeleted = deleted => pfs.writeFile(`${__dirname}/../../deleted-clients.json`, JSON.stringify(deleted, null, 4));

const get = async name => {
    const clients = await pfs.readJSON(`${__dirname}/../../clients.json`);
    if (name === undefined) return clients;
    if (name in clients) return clients[name];
    throw new Error(`Cannot get client: '${name}', existing clients are '${Object.keys(clients).join(`', '`)}'`);
}

const getDeleted = async () => (await pfs.readJSON(`${__dirname}/../../deleted-clients.json`)) || [];

const find = async (identifier = '') => {
    if (typeof identifier !== 'string') throw new Error(`Invalid identifier: '${identifier}', must be string`);
    const clients = await get();
    const [client] = [
        (name = '', client) => name === identifier,
        (name, { email = '' }) => email === identifier,
        (name = '', client) => name.toLowerCase() === identifier.toLowerCase(),
        (name, { email = '' }) => email.toLowerCase() === identifier.toLowerCase(),
    ].reduce(([found, clients], cb) => (
        found ?
            [found]
            :
            [
                clients.reduce((found, [name, client]) => (
                    found || (
                        cb(name, client) ?
                            client
                            :
                            undefined
                    )
                ), undefined),
                clients
            ]
    ), [undefined, Object.entries(clients)]);
    if (!client) throw new Error(`Could not find client: '${identifier}', please specify client by name or email: ${Object.entries(clients).map(([name, { email }]) => `'${name}' - '${email}'`)}`);
    return client;
}

const validate = ({
    name,
    email,
    rate,
    units,
}) => {
    if (name !== undefined) {
        if (typeof name !== 'string') throw new Error(`Invalid name: '${name}', must be a string`);
        if (name.trim().length < 1) throw new Error(`Invalid name: '${name}', must contain non-whitespace characters`);
    }
    if (email !== undefined) {
        if (typeof email !== 'string') throw new Error(`Invalid email: '${email}', must be a string`);
        if (!email.match(/^\S+@\S+\.\S+/)) throw new Error(`Invalid email: '${email}'`);
    }
    if (rate !== undefined) {
        if (typeof rate !== 'number') throw new Error(`Invalid rate: '${rate}', must be a number`);
        if (rate < 0) throw new Error(`Invalid rate: '${rate}', must be positive`);
    }
    if (units !== undefined) {
        if (typeof units !== 'string') throw new Error(`Invalid units: '${units}', must be a string`);
        if (!units.match(/\$\/(min|hr|day|wk|mo)/)) throw new Error(`Invalid units: '${units}', must follow pattern: $/(min|hr|day|wk|mo)`);
    }
}

const create = async ({
    name,
    email,
    rate,
    units,
}) => {
    validate({ name, email, rate, units });
    if (!name || !name.trim()) throw new Error(`Cannot create client with no name, please enter a name`);
    const oldClients = await get();
    const existingClient = oldClients[name];
    if (existingClient) throw new Error(`Cannot create, client with name: '${name}' already exists`);
    const newClients = {
        ...oldClients,
        [name]: {
            name,
            email,
            rate,
            units,
            entries: {
                uninvoiced: {},
            },
        },
    };
    write(newClients);
}

const update = async (identifier, {
    name,
    email,
    rate,
    units,
}) => {
    const oldClients = await get();
    const oldClient = await find(identifier);
    validate({ name, email, rate, units });
    const newClient = {
        ...oldClient,
        ...removeNullValues({
            name,
            email,
            rate,
            units,
        }),
    };
    const newClients = removeNullValues({
        ...oldClients,
        [oldClient.name]: undefined,
        [newClient.name]: newClient,
    });
    write(newClients);
}

const _delete = async identifier => {
    const oldClients = await get();
    const client = await find(identifier);
    const newClients = removeNullValues({
        ...oldClients,
        [client.name]: undefined,
    });
    const deleted = await getDeleted();
    await writeDeleted(deleted.concat(client));
    write(newClients);
}

module.exports = {
    get,
    find,
    create,
    update,
    _delete,
};
