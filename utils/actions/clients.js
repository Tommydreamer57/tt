const pfs = require('../functions/promise-fs');

const get = name => {
    const clients = require('../../clients.json');
    if (name === undefined) return clients;
    if (name in clients) return clients[name];
    throw new Error(`Cannot get client: '${name}', existing clients are '${Object.keys(clients).join(`', '`)}'`);
}

const find = identifier => [
    (name = '', client) => name === identifier,
    (name, { email = '' }) => email === identifier,
    (name = '', client) => name.toLowerCase() === identifier.toLowerCase(),
    (name, { email = '' }) => email.toLowerCase() === identifier.toLowerCase(),
].reduce((clients, cb) => (
    Array.isArray(clients) ?
        clients.reduce((found, [name, client]) => (
            found || (
                cb(name, client)
                &&
                client
            )
        ), null) || clients
        :
        clients
), Object.entries(get()));

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

const create = ({
    name,
    email,
    rate,
    units,
}) => {
    validate({ name, email, rate, units });
    if (!name || !name.trim()) throw new Error(`Cannot create client with no name, please enter a name`);
    const oldClients = get();
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
    pfs.writeFile(`${__dirname}/../../clients.json`, JSON.stringify(newClients, null, 4));
}

const update = (identifier, {
    name,
    email,
    rate,
    units,
}) => {
    validate({ name, email, rate, units });
}

const _delete = identifier => {

}

module.exports = {
    get,
    find,
    create,
    update,
    _delete,
};
