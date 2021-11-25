const Blooket = require('../index')

const client = new Blooket();

const authToken = ""; // put your blooket auth token

client.getAccountData(authToken);

client.on('accountData', data => {
    
    const setId = "600b1491d42a140004d5215a"; // https://www.blooket.com/set/600b1491d42a140004d5215a
    const accountName = data.name;

    client.spamPlayGame(setId, accountName, authToken, 100);

    client.on('spamPlays', () => {
        console.log('Game played!')
    });
});