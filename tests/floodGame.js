const Blooket = require('../index');

const client = new Blooket();

client.floodGame('922159', 'glixzzy', 100)

client.on('flood', data => {
    console.log('Joined game with name: ' + data.player);
});
