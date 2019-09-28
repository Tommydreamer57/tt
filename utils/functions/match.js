
const invokeIfCallback = (cb, ...args) => typeof cb === 'function' ?
    cb(...args)
    :
    cb;

const final = result => ({
    finally: cb => cb(result),
});

const matched = result => ({
    on: () => matched(result),
    case: () => matched(result),
    against: () => matched(result),
    equals: () => matched(result),
    regex: () => matched(result),
    otherwise: () => result,
    finally: () => { throw new Error(`Must use \`otherwise()\` before using finally()`) },
});

const match = (...inputs) => ({
    on: (pred, cb) => pred(...inputs) ? matched(invokeIfCallback(cb, ...inputs)) : match(...inputs),
    case: (condition, cb) => condition ? matched(invokeIfCallback(cb, ...inputs)) : match(...inputs),
    ...onlyOneInput(inputs, {
        against: obj => Object.entries(obj)
            .reduce((acc, [key, cb]) => (
                acc.equals(key, cb)
            ), match(`${inputs[0]}`)),
        equals: (val, cb) => (inputs[0] === val ? matched(invokeIfCallback(cb, ...inputs)) : match(...inputs)),
        regex: typeof inputs[0] === 'string' ?
            (regex, cb) => inputs[0].match(regex) ? matched(invokeIfCallback(cb, ...inputs)) : match(...inputs)
            :
            () => { throw new Error(`Cannot use \`regex()\` on non-string match. Received value: ${inputs[0]}`) },
    }),
    otherwise: cb => invokeIfCallback(cb, ...inputs),
    finally: () => { throw new Error(`Must use \`otherwise()\` before using finally()`) },
});

const matchAsync = promise => promise.then(match);

const onlyOneInput = (inputs, obj) => Object.entries(obj).reduce((acc, [fnName, cb]) => ({
    ...acc,
    [fnName]: inputs.length <= 1 ?
        cb
        :
        () => {
            throw new Error(`Cannot use \`match().${fnName}()\` with more than one input, received ${inputs.length} inputs: '${inputs.join(`', '`)}'`);
        }
}), {});

module.exports = {
    final,
    match,
    matchAsync,
};
