const Blooket = require('../index')

const client = new Blooket();

const authToken = ""; // put your blooket auth token

client.getAccountData(authToken);

client.on('accountData', data => {
    const name = data.name;
    const tokenAmount = 500;
    const xpAmount = 300;

    client.addTokens(tokenAmount, xpAmount, name, authToken);

    client.on('tokensAdded', () => {
        console.log(`${tokenAmount} tokens and ${xpAmount} XP added to your account!`);
    });
});