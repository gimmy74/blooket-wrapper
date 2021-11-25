const Blooket = require('../index')

const client = new Blooket();

(async () => {
    const gamePin = "198804";

    const game = client.getGameData(gamePin)
    const gameData = await game;

    const set = gameData.host.set;

    const answers = client.getAnswers(set);
    const answersData = await answers;
    
    answersData.forEach(data => {
        console.log(data);
    });
})();