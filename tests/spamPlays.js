const Blooket = require('../index')

const client = new Blooket();

(async () => {
    const login = client.login('email', 'password');
    const loginData = await login;
    const authToken = loginData.token;

    const account = client.getAccountData(authToken);
    const accountData = await account;
    
    const setId = "619ffd8626263900c33b3db8";
    const name = accountData.name;


    client.spamPlayGame(setId, name, authToken, 100);

    client.on('spamPlays', data => {
        console.log('Played game: ' + data.setId);
    });
})();