const Blooket = require('../index');

const client = new Blooket();

(async () => {
    const login = client.login('myEmail@gmail.com', 'myPassword123');
    const loginData = await login;
    const authToken = loginData.token;

    const account = client.getAccountData(authToken);
    const accountData = await account;
    const name = accountData.name;

    const tokenAmount = 500;
    const xpAmount = 300;

    const addTokens = client.addTokens(tokenAmount, xpAmount, name, authToken);
    const addTokensData = await addTokens;

    console.log(addTokensData);
    console.log('Added ' + tokenAmount + ' tokens and ' + xpAmount + ' XP to your account.');
})();