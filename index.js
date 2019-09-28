const {
    actions: {
        clients,
        entries,
        invoices,
        settings,
    },
} = require('./utils');

async function run() {
    try {
        // console.log('setting default client to Sample Client');
        // await settings.set('default-client', 'Sample Client');

        // console.log('creating new client');
        // await clients.create({
        //     name: `New Client ${Object.keys(clients.get()).length}`,
        //     email: "new@client.com",
        //     rate: 10,
        //     units: "$/hr",
        // });

        // console.log(clients.find('SAMPLE@client.com'));

        const client = await clients.find('sample client');
        console.log(client);

        await clients.update('sample client', { name: "Client 1", rate: 20 });

        console.log('updated sample client');
        
        await clients._delete('client 1');

        console.log('deleted sample client');
        
        await clients.create(client);

        console.log('recreated sample client');

        console.log('success!');
    } catch (err) {
        console.error(err);
    }
}

run();
