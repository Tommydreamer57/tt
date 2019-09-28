const {
    actions: {
        clients,
        entries,
        invoices,
        settings,
    },
} = require('./utils');

async function run() {
    // console.log('setting default client to Sample Client');
    // await settings.set('default-client', 'Sample Client');
    console.log('creating new client');
    try {
        console.log(clients.find('SAMPLE@client.com'));
    } catch (err) {
        console.error(err);
    }
    // await clients.create({
    //     name: `New Client ${Object.keys(clients.get()).length}`,
    //     email: "new@client.com",
    //     rate: 10,
    //     units: "$/hr",
    // });
    console.log('success!');
}

run();
