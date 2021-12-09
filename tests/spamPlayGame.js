const Blooket = require('../index')

const client = new Blooket();

(async () => {
    const login = await client.login('__glizzy', 'Glizzy123');
    const authToken = login.token;

    const account = await client.getAccountData(authToken);
    
    const setId = "61b151c13a350244153fb4d7";
    const name = account.name;


    client.spamPlayGame(setId, name, authToken, 100);

    client.on('spamPlays', data => {
        console.log('Played game: ' + data.setId);
    });
})();