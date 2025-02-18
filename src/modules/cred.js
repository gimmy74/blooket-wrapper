const axios = require('axios');

const errors = require('../errors/errors');
const { checkPinType, checkNameType } = require('../errors/typeofs');

const isGameAlive = require('../utils/isGameAlive');
const join = require('../utils/join');
const verify = require('../utils/verify');

async function getCred(gamePin, botName) {
    checkPinType(gamePin);
    checkNameType(botName);

    const checkGamePin = await isGameAlive(gamePin);

    if (checkGamePin.success == true) {
        const joinData = await join(gamePin, botName);

        const fbToken = joinData.fbToken;

        const idToken = await verify(fbToken);

        return idToken
    } else {
        throw new Error(errors.onJoin.invalidGame);
    };
};

module.exports = getCred