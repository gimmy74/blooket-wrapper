const Blooket = require('../../index');

const client = new Blooket();

client.stealGold('211958', 'wmaifa', 1000);

client.on('goldStolen', data => {
    console.log('Gold stolen from player: ' + data.player);
});