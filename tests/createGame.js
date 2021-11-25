const Blooket = require('../index');

const client = new Blooket();

(async () => {
    const login = client.login('myemail@gmail.com', 'mypasssowrd123');
    const loginData = await login;
    const authToken = loginData.token;

    const account = client.getAccountData(authToken);
    const accountData = await account;

    const hostName = accountData.name;
    const isPlus = accountData.plus == "Starter" ? false : true;
    const gameSetId = "600b1491d42a140004d5215a"; //https://www.blooket.com/set/600b1491d42a140004d5215a

    client.createGame(hostName, isPlus, gameSetId, 'Time', 'Gold', authToken);

    client.on('gameCreated', data => {
        console.log('Game created: ' + data.gamePin);
    });
})();