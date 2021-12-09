const axios = require('axios');

const live = require('../utils/live');
const verify = require('../utils/verify');

async function liveCred(hostName, isPlus, qSetId, newDateISOString, t_a, gameMode, authToken) {
    const liveData = await live(hostName, isPlus, qSetId, newDateISOString, t_a, gameMode, authToken);

    const idToken = await verify(liveData.fbToken);

    return {
        _idToken: idToken,
        _id: liveData.id
    };
};

module.exports = liveCred