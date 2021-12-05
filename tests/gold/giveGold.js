const Blooket = require('../../index');

const client = new Blooket();

client.giveGold('211958', 'wmaifa', 92191);

client.on('goldGiven', data => {
    console.log('Gold given to player: ' + data.player);
});
