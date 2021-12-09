const axios = require('axios');

const utils = require('../assets/links');

async function live(hostName, isPlus, qSetId, newDateISOString, t_a, gameMode, authToken) {
    const response = await axios.post(utils.links.live, {
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

    return {
        fbToken: response.data.fbToken,
        id: response.data.id
    };
};

module.exports = live