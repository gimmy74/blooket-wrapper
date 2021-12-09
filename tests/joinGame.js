const Blooket = require('../index');

const client = new Blooket();

client.joinGame('922159', 'glixzzy', 'Dog')

client.on('Joined', data => {
    console.log(data);
});