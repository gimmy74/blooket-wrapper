const Blooket = require('../../index');

const client = new Blooket();

client.giveGold('766295', 'glizz', 1000);

client.on('goldGiven', data => {
    console.log('Gold stolen from player: ' + data.player);
});