const axios = require('axios');

const utils = require('../assets/links');

async function isFavorited(setId, authToken) {
    const response = await axios(utils.links.isFavorited + setId, {
        headers: {
            authorization: authToken,
        },
    });

    return response.data
};

module.exports = isFavorited