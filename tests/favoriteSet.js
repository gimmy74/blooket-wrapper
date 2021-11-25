const Blooket = require('../index')

const client = new Blooket();

const authToken = ""; // put your blooket auth token

client.getAccountData(authToken);

client.on('accountData', data => {
    const name = data.name;

    client.favoriteSet('600b1491d42a140004d5215a', name, authToken) //https://www.blooket.com/set/600b1491d42a140004d5215a

    client.on('favorited', message => {
        console.log('Favorited set: ' + message.set);
    });
});