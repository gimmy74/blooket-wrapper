module.exports = {
    join: (gamePin, botName, blook) => {
        return JSON.stringify({ "t": "d", "d": { "r": 2, "a": "p", "b": { "p": "/" + gamePin + "/c/" + botName, "d": { "b": blook } } } });
    },

    authorize: (authToken) => {
        return JSON.stringify({ "t": "d", "d": { "r": 1, "a": "auth", "b": { "cred": authToken } } })
    },

    live: {
        createGame: (gamePin, hostName, isPlus, newDateISOString, t_a, gameMode, qSetId) => {
            return JSON.stringify({ "t": "d", "d": { "r": 3, "a": "p", "b": { "p": "/" + gamePin, "d": { "ho": hostName, "p": isPlus, "s": { "d": newDateISOString, "la": true, "m": t_a, "t": gameMode }, "set": qSetId, "stg": "join" } } } })
        },
    },

    gold: {
        join: (gamePin, botName, blook) => {
            return JSON.stringify({ "t": "d", "d": { "r": 6, "a": "p", "b": { "p": `/` + gamePin + `/c/` + botName, "d": { "b": blook, "g": 999999 } } } })
        },

        steal: (gamePin, botName, randomBlook, victimName, goldAmount) => {
            return JSON.stringify({ "t": "d", "d": { "r": 18, "a": "p", "b": { "p": "/" + gamePin + "/c/" + botName, "d": { "b": randomBlook, "g": 0, "tat": victimName + ":" + goldAmount } } } })
        },

        give: (gamePin, botName, randomBlook, victimName, goldAmount) => {
            return JSON.stringify({ "t": "d", "d": { "r": 18, "a": "p", "b": { "p": "/" + gamePin + "/c/" + botName, "d": { "b": randomBlook, "g": 0, "tat": victimName + ":swap:" + goldAmount } } } })
        },
    },

    toy: {
       join: (gamePin, botName, blook) => {
            return JSON.stringify({ "t": "d", "d": { "r": 6, "a": "p", "b": { "p": `/` + gamePin + `/c/` + botName, "d": { "b": blook, "t": 9999999999 } } } })
        },

       steal: (gamePin, botName, randomBlook, victimName, toyAmount) => {
            return JSON.stringify({ "t": "d", "d": { "r": 18, "a": "p", "b": { "p": "/" + gamePin + "/c/" + botName, "d": { "b": randomBlook, "g": 0, "tat": victimName + ":" + toyAmount } } } })
        },

        give: (gamePin, botName, randomBlook, victimName, toyAmount) => {
            return JSON.stringify({ "t": "d", "d": { "r": 18, "a": "p", "b": { "p": "/" + gamePin + "/c/" + botName, "d": { "b": randomBlook, "g": 0, "tat": victimName + ":swap:" + toyAmount } } } })
        },
    },


    racing: {
        endGame: (gamePin, botName, goalAmount) => {
            return JSON.stringify({ "t": "d", "d": { "r": 12, "a": "p", "b": { "p": "/" + gamePin + "/c/" + botName, "d": { "b": "Dog", "pr": goalAmount } } } })
        },
    },
};
