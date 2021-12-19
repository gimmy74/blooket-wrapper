const axios = require('axios');
const WebSocket = require('ws');
const EventEmitter = require('events');
const crypto = require('crypto');

const messages = require('./assets/messages');
const utils = require('./assets/links');

const errors = require('./errors/errors');
const APIResponseMessages = require('./errors/APIResponseErrors');
const { checkPinType, checkNameType, checkAmountType } = require('./errors/typeofs');

const getCred = require('./modules/cred');
const liveCred = require('./modules/liveCred');
const findSocketUri = require('./modules/findSocketUri');

const serverCodes = require('./utils/serverCodes');
const isGameAlive = require('./utils/isGameAlive');
const getRandomBlook = require('./utils/getRandomBlook');
const isFavorited = require('./utils/isFavorited');

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
     * @function joinGame
     * @param {string} gamePin 
     * @param {string} botName 
     * @param {string} blook 
     */

    async joinGame(gamePin, botName, blook) {
        checkPinType(gamePin);
        checkNameType(botName);

        const game = await this.getGameData(gamePin);

        const data = {
            blook: blook,
            name: botName,
            gameSet: game.host.set,
            gameMode: game.host.s.t
        }

        const cred = await getCred(gamePin, botName)

        const ranges = serverCodes();

        ranges.forEach(async range => {
            const socketUrl = await findSocketUri(range.code);

            const ws = new WebSocket(socketUrl);

            ws.on('open', () => {
                ws.send(messages.authorize(cred))
                ws.send(messages.join(gamePin, botName, blook))
            });
        });

        this.emit('Joined', data)
    };

    /**
     * @function floodGame
     * @param {string} gamePin 
     * @param {string} amount 
     */

    async floodGame(gamePin, amount) {
        checkPinType(gamePin);

        if (amount > 100) {
            throw new Error(errors.onJoin.amount);
        } else {
            for (let i = 0; i < amount; i++) {
                const botName = crypto.randomBytes(10).toString('hex');
                const randomBlook = getRandomBlook();

                const cred = await getCred(gamePin, botName);

                const ranges = serverCodes();

                ranges.forEach(async range => {
                    const socketUrl = await findSocketUri(range.code);

                    const ws = new WebSocket(socketUrl);

                    ws.on('open', () => {
                        ws.send(messages.authorize(cred))
                        ws.send(messages.join(gamePin, botName, randomBlook))
                    });
                });

                this.emit('flood', { player: botName });
            };
        };
    };

    /**
     * @function createGame
     * @param {string} hostName 
     * @param {boolean} isPlus 
     * @param {string} qSetId 
     * @param {string} t_a 
     * @param {string} gameMode 
     * @param {string} authToken 
     */

    async createGame(hostName, isPlus, qSetId, t_a /* t = True | a = Amount */, gameMode, authToken) {
        const dateISOString = new Date().toISOString();

        const liveData = await liveCred(hostName, isPlus, qSetId, dateISOString, t_a, gameMode, authToken);
        const cred = liveData._idToken
        const gamePin = liveData._id

        const ranges = serverCodes();

        ranges.forEach(async range => {
            const socketUrl = await findSocketUri(range.code);

            const ws = new WebSocket(socketUrl);

            ws.on('open', () => {
                ws.send(messages.authorize(cred))
                ws.send(messages.live.createGame(gamePin, hostName, isPlus, dateISOString, t_a, gameMode, qSetId))
            });
        });

        this.emit('gameCreated', { gamePin: gamePin });
    };

    /**
     * @function login
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise}
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
     * @function getAccountData
     * @param {string} authToken 
     * @returns {Promise}
     */

    async getAccountData(authToken) {
        const modifiedAuthToken = authToken.split('JWT ')[1];

        const response = await axios(utils.links.verifyAcc + modifiedAuthToken);

        if (response.data == null) {
            throw new Error(errors.data.invalidAuthToken);
        };

        return response.data
    };

    /**
     * @function getGameData
     * @param {string} gamePin 
     * @returns {Promise}
     */

    async getGameData(gamePin) {
        checkPinType(gamePin);

        const botName = crypto.randomBytes(10).toString('hex');

        const checkGamePin = await isGameAlive(gamePin)

        if (checkGamePin.success == true) {
            const response = await axios.put(utils.links.join, {
                id: gamePin,
                name: botName,
            }, {
                headers: {
                    Referer: 'https://www.blooket.com/',
                },
            });

            return response.data
        } else {
            throw new Error(errors.onJoin.invalidGame);
        };
    };

    /**
     * @function getAnswers
     * @param {string} gamePin 
     * @returns {Promise}
     */

    async getAnswers(gamePin) {
        checkPinType(gamePin);

        const game = await this.getGameData(gamePin);

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
     * @function spamPlayGame
     * @param {string} setId 
     * @param {string} name 
     * @param {string} authToken 
     * @param {amount} amount 
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
     * @function favoriteSet
     * @param {string} setId 
     * @param {string} name 
     * @param {string} authToken 
     * @returns {Promise}
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
            throw new Error(errors.favorite.favorited);
        };
    };

    /**
     * @function createSet
     * @param {string} author 
     * @param {string} desc 
     * @param {boolean} isPrivate 
     * @param {string} title 
     * @param {string} authToken 
     * @returns {Promise}
     */

    async createSet(author, desc, isPrivate, title, authToken) {
        const response = await axios.post(utils.links.games, {
            author: author,
            coverImage: {},
            desc: desc,
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
     * @function addTokens
     * @param {string} tokenAmount 
     * @param {string} xpAmount 
     * @param {string} name 
     * @param {string} authToken 
     * @returns {Promise}
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
     * @function getHistories
     * @param {string} authToken 
     * @returns {Promise}
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
     * @function getHomeworks
     * @param {string} authToken 
     * @returns {Promise}
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
     * @function deleteHomework
     * @param {string} setId 
     * @param {string} authToken 
     * @returns {Promise}
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
     * @function getBlooks
     * @param {string} authToken 
     * @returns {Promise}
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
     * @function getTokens
     * @param {string} authToken 
     * @returns {Promise}
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
     * @function getStats
     * @param {string} authToken
     * @returns {Promise}
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
     * @function getUserData
     * @param {string} name
     * @param {string} authToken
     * @returns {Promise}
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

    /**
     * @function openBox
     * @param {string} box 
     * @param {string} name 
     * @param {string} authToken 
     * @returns {Promise}
     */

    async openBox(box, name, authToken) {
        checkNameType(name);

        const response = await axios.put(utils.links.unlock, {
            box: box,
            name: name,
        }, {
            headers: {
                authorization: authToken,
            },
        });

        return response.data
    };
 
    /**
     * @function sellBlook
     * @param {string} blook 
     * @param {string} name 
     * @param {number} numSold 
     * @param {string} authToken 
     * @returns {Promise}
     */

    async sellBlook(blook, name, numSold, authToken) {
        checkAmountType(numSold);
        checkNameType(name)

        const response = await axios.put(utils.links.sell, {
            blook: blook,
            name: name,
            numSold: numSold,
        }, {
            headers: {
                authorization: authToken,
            },
        });

        return response.data
    };

    /* Global End */

    /* Gold Quest */

    /**
     * @function stealGold
     * @param {string} gamePin 
     * @param {string} victimName 
     * @param {number} goldAmount 
     */

    async stealGold(gamePin, victimName, goldAmount) {
        checkAmountType(goldAmount)

        const botName = "hecker" + Math.floor(100 + Math.random() * 900).toString();
        const randomBlook = getRandomBlook();

        const cred = await getCred(gamePin, botName);
        const game = await this.getGameData(gamePin);

        const names = Object.keys(game.host.c);

        if (!names.includes(victimName)) throw new Error(victimName + " " + errors.gold.playerExists);

        const ranges = serverCodes();

        if (game.host.s.t != "Gold") {
            throw new Error(errors.gold.func);
        } else {
            ranges.forEach(async range => {
                const socketUrl = await findSocketUri(range.code);

                const ws = new WebSocket(socketUrl);

                ws.on('open', () => {
                    ws.send(messages.authorize(cred))
                    ws.send(messages.gold.join(gamePin, botName, randomBlook))
                    ws.send(messages.gold.steal(gamePin, botName, randomBlook, victimName, goldAmount))
                });
            });

            this.emit('goldStolen', { player: victimName });
        };
    };

    /**
     * @function giveGold
     * @param {string} gamePin 
     * @param {string} victimName 
     * @param {number} goldAmount 
     */

    async giveGold(gamePin, victimName, goldAmount) {
        checkAmountType(goldAmount);

        const botName = "hecker" + Math.floor(100 + Math.random() * 900).toString();
        const randomBlook = getRandomBlook();

        const cred = await getCred(gamePin, botName);
        const game = await this.getGameData(gamePin);

        const names = Object.keys(game.host.c)

        if (!names.includes(victimName)) throw new Error(victimName + " " + errors.gold.playerExists);

        const ranges = serverCodes();

        if (game.host.s.t != "Gold") {
            throw new Error(errors.gold.func);
        } else {
            ranges.forEach(async range => {
                const socketUrl = await findSocketUri(range.code);

                const ws = new WebSocket(socketUrl);

                ws.on('open', () => {
                    ws.send(messages.authorize(cred))
                    ws.send(messages.gold.join(gamePin, botName, randomBlook))
                    ws.send(messages.gold.give(gamePin, botName, randomBlook, victimName, goldAmount))
                });
            });

            this.emit('goldGiven', { player: victimName });
        };
    };

    /* Gold Quest End */

    /* Racing */

    async endGame(gamePin) {
        const botName = "hecker" + Math.floor(100 + Math.random() * 900).toString();

        const cred = await getCred(gamePin, botName);
        const game = await this.getGameData(gamePin);

        const goalAmount = game.host.s.a

        const ranges = serverCodes();

        if (game.host.s.t != "Racing") {
            throw new Error(errors.racing.func);
        } else {
            ranges.forEach(async range => {
                const socketUrl = await findSocketUri(range.code);

                const ws = new WebSocket(socketUrl);

                ws.on('open', () => {
                    ws.send(messages.authorize(cred))
                    ws.send(messages.join(gamePin, botName, "Dog"))
                    ws.send(messages.racing.endGame(gamePin, botName, goalAmount))
                });
            });

            this.emit('gameEnded', { pin: gamePin });
        };
    };

    /* Racing End */
    
    /* Santas workshop */

    async giveToys(gamePin, victimName, toyAmount) {
        checkAmountType(toyAmount);
        const botName = "hecker" + Math.floor(100 + Math.random() * 900).toString();
        const randomBlook = getRandomBlook();

        const cred = await getCred(gamePin, botName);
        const game = await this.getGameData(gamePin);

        const names = Object.keys(game.host.c)

        if (!names.includes(victimName)) throw new Error(victimName + " " + errors.toy.playerExists);

        const ranges = serverCodes();

        if (game.host.s.t != "Toy") {
            throw new Error(errors.toy.func);
        } else {
            ranges.forEach(async range => {
                const socketUrl = await findSocketUri(range.code);

                const ws = new WebSocket(socketUrl);

                ws.on('open', () => {
                    ws.send(messages.authorize(cred))
                    ws.send(messages.toy.join(gamePin, botName, randomBlook))
                    ws.send(messages.toy.give(gamePin, botName, randomBlook, victimName, toyAmount))
                });
            });

            this.emit('toysGiven', { player: victimName });
        };
    };

    async stealToys(gamePin, victimName, toyAmount) {
        checkAmountType(toyAmount)
        
        const botName = "hecker" + Math.floor(100 + Math.random() * 900).toString();
        const randomBlook = getRandomBlook();

        const cred = await getCred(gamePin, botName);
        const game = await this.getGameData(gamePin);

        const names = Object.keys(game.host.c);

        if (!names.includes(victimName)) throw new Error(victimName + " " + errors.toy.playerExists);

        const ranges = serverCodes();

        if (game.host.s.t != "Toy") {
            throw new Error(errors.toy.func);
        } else {
            ranges.forEach(async range => {
                const socketUrl = await findSocketUri(range.code);

                const ws = new WebSocket(socketUrl);

                ws.on('open', () => {
                    ws.send(messages.authorize(cred))
                    ws.send(messages.toy.join(gamePin, botName, randomBlook))
                    ws.send(messages.toy.steal(gamePin, botName, randomBlook, victimName, toyAmount))
                });
            });

            this.emit('toysStolen', { player: victimName });
        };
    };
    
  /* Santas Workshop End */
    
};

module.exports = Blooket


// crypto hack - nothing to add
// fishing frenzy - nothing to add
// tower defense - nothing to add
// cafe - nothing to add
// battle royale - nothing to add
// factory - nothing to add
