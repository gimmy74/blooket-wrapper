const Blooket = require('../index')

const client = new Blooket();

const authToken = ""; // put your blooket auth token

client.deleteSet('5fda2c0b4736cc0004ac931f', authToken);

client.on('setDeleted', data => {
    console.log(data)
})