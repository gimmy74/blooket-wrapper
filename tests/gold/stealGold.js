const Blooket = require('../../index');

const client = new Blooket();

client.stealGold('766295', 'glizz', 1000);

client.on('goldStolen', data => {
    console.log('Gold stolen from player: ' + data.player);
});