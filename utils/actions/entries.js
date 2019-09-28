const pfs = require('../functions/promise-fs');
const clients = require('./clients');
const settings = require('./settings');

const create = async ({
    client: identifier,
    date = new Date(Date.now()).getDate(),
    time = new Date(Date.now()).getTime(),
    hours,
    description,
}) => {
    const client = await clients.get(identifier || await settings.get('default-client'));
    
}

const update = async ({
    client: identifier,
    date = new Date(Date.now()).getDate(),
    time = new Date(Date.now()).getTime(),
    hours,
    description,
}) => {

}

const _delete = async ({
    client: identifier,
    date,
    time,
    hours,
    description,
}) => {

}

module.exports = {
    create,
    update,
    _delete,
};
