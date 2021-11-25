const Blooket = require('../index')

const client = new Blooket();

client.getGameData('223669');

client.on('gameData', data => {
    const setId = data.host.set

    client.getAnswers(setId);
    
    client.on('answers', message => {
        console.log('Question: ' + message.question + ' | Answer: ' + message.answer[0]);
    });
});