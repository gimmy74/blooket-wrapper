const Blooket = require('../index')

const client = new Blooket();

(async () => {
    const login = client.login('myemail@gmail.com', 'MyPassword123');

    const authToken = await login;

    console.log(authToken.token);
})();