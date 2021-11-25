const Blooket = require('../index');

const client = new Blooket();

const authToken = "" /* put your blooket auth token */

client.getAccountData(authToken);

client.on('accountData', message => {
    const hostName = message.name
    const isPlus = message.plan == 'Starter' ? false : true
    const gameSetId = "600b1491d42a140004d5215a"
    const newDateISOString = new Date().toISOString();

    client.createGame(hostName, isPlus, gameSetId, newDateISOString, 'Time', 'Gold', authToken)

    client.on('gameCreated', data => {
        console.log("Game Created: " + data)
    });
});