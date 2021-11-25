const Blooket = require('../index')

const client = new Blooket();

(async () => {
    const login = client.login('email', 'password');
    const loginData = await login;
    const authToken = loginData.token;

    const account = client.getAccountData(authToken);
    const accountData = await account;
    const name = accountData.name;

    const setId = "619ffa8f76a076b181439489";
    
    const favorite = client.favoriteSet(setId, name, authToken);
    const favoriteData = await favorite;
    
    console.log(favoriteData);
})();