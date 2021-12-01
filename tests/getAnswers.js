const Blooket = require('../index')

const client = new Blooket();

(async () => {
    const gamePin = "753617";

    const answers = await client.getAnswers(gamePin);
    
    answers.forEach(answer => {
        console.log(answer);
    });
})();