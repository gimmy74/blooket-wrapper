const axios = require('axios');
const WebSocket = require('ws');
const EventEmitter = require('events');
const crypto = require('crypto');

const messages = require('./assets/messages');
const utils = require('./assets/links');

const APIResponseMessages = require('./errors/APIResponseErrors');

const { checkPinType } = require('./errors/typeofs');

const findSocketUri = require('./modules/findSocket');
const verifyToken = require('./modules/verifyToken');
const verifyLiveToken = require('./modules/verifyLiveToken');

const checkGamePin = require('./utils/checkGamePin');
const serverCodes = require('./utils/serverCodes');
const getGameData = require('./utils/getGameData');
const isFavorited = require('./utils/isFavorited');
const getRandomBlook = require('./utils/getRandomBlook');


/**
 * new Blooket
 * @class
 * @classdesc Game manipulation & normal API usage
 */
class Blooket extends EventEmitter {
    constructor() {
        super();
    };

    /* Global */

    /**
     * 
     * @function joinGame
     * @param {string} gamePin - Game pin used to enter in a game
     * @param {string} botName - Name used to join a game
     * @param {string} blook - Blook chosed to play with in a game
     */

    async joinGame(gamePin, botName, blook) {
        const socketAuthToken = await verifyToken(gamePin, botName);
        const game = await getGameData(gamePin, botName);

        const data = {
            blook: blook,
            name: botName,
            gameSet: game.host.set,
            gameMode: game.host.s.t
        };

        const ranges = serverCodes();

        ranges.forEach(async range => {
            const socketUrl = await findSocketUri(range.code);

            const ws = new WebSocket(socketUrl);

            ws.on('open', () => {
                ws.send(messages.authorize(socketAuthToken))
                ws.send(messages.joinMessage(gamePin, botName, blook))
            });
        });

        this.emit('Joined', data);
    };

    /**
     * 
     * @function floodGames
     * @param {string} gamePin - Game pin used to enter in a game
     * @param {number} amount - Amount of bots you want to flood the game
     */

    async floodGames(gamePin, amount) {

        if (amount > 100) /* only change this if statement if you know what you're doing but strongly suggested not to change. */ {
            throw new Error('Maximum bot allowed is 100 to avoid ratelimits.');
        };

        for (let i = 0; i < amount; i++) {
            const botName = crypto.randomBytes(10).toString('hex');

            const socketAuthToken = await verifyToken(gamePin, botName);

            const ranges = serverCodes();

            ranges.forEach(async range => {
                const socketUrl = await findSocketUri(range.code);

                const ws = new WebSocket(socketUrl);

                ws.on('open', () => {
                    ws.send(messages.authorize(socketAuthToken))
                    ws.send(messages.joinMessage(gamePin, botName, getRandomBlook()))
                });
            });

            this.emit('flood', { player: botName });
        };
    };

    /**
     * 
     * @function createGame
     * @param {string} hostName - Your Blooket name
     * @param {boolean} isPlus - Is your account plus?
     * @param {string} qSetId - Game Set Id
     * @param {string} t_a - t = True | a = Amount
     * @param {string} gameMode - Gold, Crypto, and etc.
     * @param {string} authToken - Your auth token is like your login info
     */

    async createGame(hostName, isPlus, qSetId, t_a /* t_a = Time or Amount*/, gameMode, authToken) {
        const newDateISOString = new Date().toISOString();

        const socketData = await verifyLiveToken(hostName, isPlus, qSetId, newDateISOString, t_a, gameMode, authToken)

        const ranges = serverCodes();

        ranges.forEach(async range => {
            const socketUrl = await findSocketUri(range.code);

            const ws = new WebSocket(socketUrl);

            ws.on('open', () => {
                ws.send(messages.authorize(socketData.cred));
                ws.send(JSON.stringify({ "t": "d", "d": { "r": 3, "a": "p", "b": { "p": "/" + socketData.id, "d": { "ho": hostName, "p": isPlus, "s": { "d": newDateISOString, "la": true, "m": t_a, "t": gameMode }, "set": qSetId, "stg": "join" } } } }))
            });
        });

        const data = { gamePin: socketData.id };

        this.emit('gameCreated', data);
    };

    /**
     * 
     * @function getAccountData
     * @param {string} authToken - Your auth token is like your login info
     * @returns {Promise} Returns response data
     */

    async getAccountData(authToken) {
        const modifiedAuthToken = authToken.split('JWT ')[1];

        const response = await axios(utils.links.verifyAcc + modifiedAuthToken);

        if (response.data == null) {
            throw new Error('Your auth token seems to be incorrect!');
        };

        return response.data
    };

    /**
     * 
     * @function getGameData
     * @param {string} gamePin - Game pin used to enter in a game 
     * @returns {Promise} Returns response data
     */

    async getGameData(gamePin) {
        checkPinType(gamePin);

        const botName = Math.floor(100000 + Math.random() * 900000).toString();

        const isGameAlive = await checkGamePin(gamePin);

        if (isGameAlive.success == true) {
            const response = await axios.put(utils.links.join, {
                id: gamePin,
                name: botName,
            }, {
                headers: {
                    Referer: 'https://www.blooket.com/',
                }
            });

            return response.data
        } else {
            throw new Error('Invalid Game Pin provided');
        };
    };

    /**
     * 
     * @function getAnswers
     * @param {string} gamePin - Game pin used to enter in a game 
     * @returns {Promise} Returns response data
     */

    async getAnswers(gamePin) {
        checkPinType(gamePin);

        const botName = "hecker" + Math.floor(100 + Math.random() * 900).toString();

        const game = await getGameData(gamePin, botName);
        
        const response = await axios(utils.links.gameQuery + game.host.set, {}, {
            headers: {
                Referer: 'https://www.blooket.com/',
            },
        });

        const data = [];

        response.data.questions.forEach(quetsion => {
            data.push("Question: " + quetsion.question + " | Answer: " + quetsion.correctAnswers)
        });

        return data
    };

    /**
     * 
     * @function spamPlayGame
     * @param {string} setId - Game Set Id
     * @param {string} name - BLooket account name
     * @param {string} authToken - Your Blooket auth token is like your login info
     * @param {number} amount - Amount of plays you want
     */

    async spamPlayGame(setId, name, authToken, amount) {
        for (let i = 0; i < amount; i++) {
            try {
                await axios.post(utils.links.history, {
                    "standings": [{}],
                    "settings": {},
                    "set": "",
                    "setId": setId,
                    "name": name,
                }, {
                    headers: {
                        authorization: authToken
                    },
                });

                this.emit('spamPlays', { setId: setId });
            } catch (e) {
                if (e.response.data == APIResponseMessages.historyAPI.MSG) {
                    console.log(APIResponseMessages.historyAPI.MSG);
                    break;
                };
            };
        };
    };

    /**
     * 
     * @function favoriteSet
     * @param {string} setId - Game Set Id
     * @param {string} name - Blooket account name
     * @param {string} authToken - Your blooket auth token is like your login info
     * @returns {Promise} Returns response data
     */

    async favoriteSet(setId, name, authToken) {
        const checkIfFavorited = await isFavorited(setId, authToken);

        if (checkIfFavorited == false) {
            const response = await axios.put(utils.links.favorite, {
                id: setId,
                isUnfavoriting: false,
                name: name,
            }, {
                headers: {
                    authorization: authToken,
                },
            });

            return response.data
        } else {
            throw new Error('You already have this game favorited!');
        };
    };

    /**
     * 
     * @function createSet
     * @param {string} author - Blooket account name 
     * @param {string} description - Description about the set
     * @param {boolean} isPrivate - Make the set private?
     * @param {string} title - Title of the set
     * @param {string} authToken - Your blooket auth token is like your login info
     * @returns {Promise} Returns response data
     */

    async createSet(author, description, isPrivate, title, authToken) {
        const response = await axios.post(utils.links.games, {
            author: author,
            coverImage: {},
            desc: description,
            private: isPrivate,
            title: title,
        }, {
            headers: {
                authorization: authToken,
            },
        });

        return response.data
    };

    /**
     * 
     * @function addTokens
     * @param {number} tokenAmount - Amount of tokens you want
     * @param {number} xpAmount - Amount of XP you want
     * @param {string} name - Blooket account name
     * @param {string} authToken 
     * @returns {Promise} Returns response data
     */

    async addTokens(tokenAmount, xpAmount, name, authToken) {
        const response = await axios.put(utils.links.rewards, {
            addedTokens: tokenAmount,
            addedXp: xpAmount,
            name: name,
        }, {
            headers: {
                authorization: authToken,
            }
        });

        return response.data
    };

    /**
     * 
     * @function login
     * @param {string} email - Blooket email used to login
     * @param {string} password - Blooket password used to login
     * @returns {Promise} Returns response data
     */

    async login(email, password) {
        const response = await axios.post(utils.links.login, {
            name: email,
            password: password,
        }, {
            headers: {
                Referer: 'https://www.blooket.com/',
            },
        });

        if (response.data.errType == APIResponseMessages.login.errType.MSG_EMAIL) {
            throw new Error(APIResponseMessages.login.MSG_E);
        } else if (response.data.errType == APIResponseMessages.login.errType.MSG_PASSWORD) {
            throw new Error(APIResponseMessages.login.MSG);
        };

        return response.data
    };

    /**
     * 
     * @function getHistories
     * @param {string} authToken - Your Blooket auth token is like your login info 
     * @returns {Promise} Returns response data
     */

    async getHistories(authToken) {
        const response = await axios(utils.links.histories, {
            headers: {
                authorization: authToken,
            },
        });

        return response.data
    };

    /**
     * 
     * @function getHomeworks
     * @param {string} authToken - Your Blooket auth token is like your login info 
     * @returns {Promise} Returns response data
     */

    async getHomeworks(authToken) {
        const response = await axios(utils.links.homeworks, {
            headers: {
                authorization: authToken,
            },
        });

        return response.data
    };

    /**
     * 
     * @function deleteHomework
     * @param {setId} setId - Game Set Id
     * @param {string} authToken - Your Blooket auth token is like your login info 
     * @returns {Promise} Returns response data
     */

    async deleteHomework(setId, authToken) {
        try {
            const response = await axios.delete(utils.links.homeWorkQuery + setId, {
                headers: {
                    authorization: authToken,
                },
            });

            return response.data
        } catch (e) {
            if (e.response.status == 404) {
                throw new Error(e.response.data);
            };
        };
    };

    /**
     * 
     * @function getBlooks
     * @param {string} authToken - Your Blooket auth token is like your login info 
     * @returns {Promise} Returns response data
     */

    async getBlooks(authToken) {
        const response = await axios(utils.links.blooks, {
            headers: {
                authorization: authToken,
            },
        });

        return response.data
    };

    /**
     * 
     * @function getTokens
     * @param {string} authToken - Your Blooket auth token is like your login info 
     * @returns {Promise} Returns response data
     */

    async getTokens(authToken) {
        const response = await axios(utils.links.tokens, {
            headers: {
                authorization: authToken,
            },
        });

        return response.data
    };

    /**
     * 
     * @function getStats
     * @param {string} authToken - Your Blooket auth token is like your login info 
     * @returns {Promise} Returns response data
     */

    async getStats(authToken) {
        const response = await axios(utils.links.users, {
            headers: {
                authorization: authToken,
            },
        });

        return response.data
    };

    /**
     * 
     * @function getUserData
     * @param {string} name - Blooket account name
     * @param {string} authToken - Your Blooket auth token is like your login info 
     * @returns {Promise} Returns response data
     */

    async getUserData(name, authToken) {
        try {
            const response = await axios(utils.links.userQuery + name, {
                headers: {
                    authorization: authToken,
                },
            });

            return response.data
        } catch (e) {
            if (e.response.status == 404) {
                throw new Error(e.response.data);
            };
        };
    };

    /* Global End */

    /* Gold Quest */

    /**
     * 
     * @function stealGold
     * @param {string} gamePin - Game pin used to enter a game
     * @param {string} victimName - Player name you want to steal gold from
     * @param {number} goldAmount - Amount of gold you want to steal from the player
     */

    async stealGold(gamePin, victimName, goldAmount) {
        const botName = "hecker" + Math.floor(100 + Math.random() * 900).toString();
        const randomBlook = getRandomBlook();

        if (typeof goldAmount != "number") {
            throw new Error("goldAmount must be a number not a string!");
        };

        const socketAuthToken = await verifyToken(gamePin, botName);
        const game = await getGameData(gamePin, botName);

        const names = Object.keys(game.host.c);

        names.forEach(name => {
            if (name != victimName) {
                throw new Error(victimName + "does not exist in the game!");
            };
        });

        const ranges = serverCodes();

        if (game.host.s.t != "Gold") {
            throw new Error('This function only works in a gold quest game mode!');
        } else {
            ranges.forEach(async range => {
                const socketUrl = await findSocketUri(range.code);

                const ws = new WebSocket(socketUrl);

                ws.on('open', () => {
                    ws.send(messages.authorize(socketAuthToken))
                    ws.send(messages.gold.joinMessage(gamePin, botName, randomBlook))
                    ws.send(messages.gold.steal(gamePin, botName, randomBlook, victimName, goldAmount))
                });
            });
        };


        this.emit('goldStolen', { player: victimName });
    };

    /**
     * 
     * @function giveGold
     * @param {string} gamePin - Game pin used to enter a game
     * @param {string} victimName - Player name you want to steal gold from
     * @param {number} goldAmount - Number of gold amount you want to give a player
     */

    async giveGold(gamePin, victimName, goldAmount) {
        const botName = "hecker" + Math.floor(100 + Math.random() * 900).toString();
        const randomBlook = getRandomBlook();

        if (typeof goldAmount != "number") {
            throw new Error("goldAmount must be a number not a string!");
        };

        const socketAuthToken = await verifyToken(gamePin, botName);
        const game = await getGameData(gamePin, botName);

        const names = Object.keys(game.host.c);

        names.forEach(name => {
            if (name != victimName) {
                throw new Error(victimName + "does not exist in the game!");
            };
        });

        const ranges = serverCodes();

        if (game.host.s.t != "Gold") {
            throw new Error('This function only works in a gold quest game mode!');
        } else {
            ranges.forEach(async range => {
                const socketUrl = await findSocketUri(range.code);

                const ws = new WebSocket(socketUrl);

                ws.on('open', () => {
                    ws.send(messages.authorize(socketAuthToken))
                    ws.send(messages.gold.joinMessage(gamePin, botName, randomBlook));
                    ws.send(messages.gold.give(gamePin, botName, randomBlook, victimName, goldAmount))
                });
            });
        };

        this.emit('goldGiven', { player: victimName });
    };

    /* Gold Quest End */

    /* Racing */
    
    /**
     * 
     * @function endGame
     * @param {string} gamePin - Game pin used to enter a game
     */

    async endGame(gamePin) {
        const botName = "hecker" + Math.floor(100 + Math.random() * 900).toString();

        const socketAuthToken = await verifyToken(gamePin, botName);
        const game = await getGameData(gamePin, botName);

        const goalAmount = game.host.s.a

        const ranges = serverCodes();

        if (game.host.s.t != "Racing") {
            throw new Error("This function is only supposed to be used in racing game mode!");
        } else {
            ranges.forEach(async range => {
                const socketUrl = await findSocketUri(range.code);

                const ws = new WebSocket(socketUrl);

                ws.on('open', () => {
                    ws.send(messages.authorize(socketAuthToken))
                    ws.send(messages.joinMessage(gamePin, botName, "Dog"))
                    ws.send(messages.racing.endGame(gamePin, botName, goalAmount))
                });
            });
        };

        this.emit('gameEnded', { pin: gamePin });
    };

    /* Racing End */



};

module.exports = Blooket


// crypto hack - nothing to add
// fishing frenzy - nothing to add
// tower defense - nothing to add
// cafe - nothing to add
// battle royale - nothing to add
// factory - nothing to add