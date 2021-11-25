const Blooket = require('../index')

const client = new Blooket();

const authToken = ""; // put your blooket auth token

client.getAccountData(authToken);

client.on('accountData', data => {
    const author = data.name;
    const desc = 'created from nodejs';
    const isPrivate = false;
    const title = 'created from nodejs';

    client.createSet(author, desc, isPrivate, title, authToken);

    client.on('setCreated', message => {
        console.log(message);
    });
});