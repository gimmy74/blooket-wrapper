const Blooket = require('../index')

const client = new Blooket();

(async () => {
    const login = await client.login('__glizzy', 'Glizzy123');
    const authToken = login.token;

    const account = await client.getAccountData(authToken);
    
    const name = account.name;

    const setId = "61b151c13a350244153fb4d7";
    
    const favorite = await client.favoriteSet(setId, name, authToken);
    
    console.log(favorite);
})();