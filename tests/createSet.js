const Blooket = require('../index')

const client = new Blooket();

(async () => {
    const login = client.login('email', 'passwod');
    const loginData = await login;
    const authToken = loginData.token;

    const account = client.getAccountData(authToken);
    const accountData = await account;

    const author = accountData.name;
    const desc = 'created from nodejs';
    const isPrivate = false;
    const title = 'created from nodejs';

    const set = client.createSet(author, desc, isPrivate, title, authToken);
    const setData = await set;

    console.log(setData);    
})();