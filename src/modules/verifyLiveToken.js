const axios = require('axios');

const utils = require('../assets/links');

async function verifyLiveToken(hostName, isPlus, qSetId, newDateISOString, t_a, gameMode, authToken) {
    const createGameResponse = await axios.post(utils.links.live, {
        hoster: hostName,
        plus: isPlus,
        qSetId: qSetId,
        settings: {
            d: newDateISOString,
            la: true,
            m: t_a,
            t: gameMode,
        },
    }, {
        headers: {
            Authorization: authToken,
            Referer: 'https://www.blooket.com/',
        },
    });

    const verifyTokenReponse = await axios.post(utils.links.verify, {
        returnSecureToken: true,
        token: createGameResponse.data.fbToken
    });

    return {
        id: createGameResponse.data.id,
        cred: verifyTokenReponse.data.idToken
    }
};

module.exports = verifyLiveToken