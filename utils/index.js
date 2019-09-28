const pfs = require('./functions/promise-fs');
const actions = require('./actions');
const { match, final } = require('./functions/match');

module.exports = {
    pfs,
    actions,
    match,
    final,
};
