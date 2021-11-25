const axios = require('axios');
const WebSocket = require('ws');
const EventEmitter = require('events');
const crypto = require('crypto');

const messages = require('./assets/messages');
const utils = require('./assets/links');

const { checkPinType } = require('./errors/typeofs');

const findSocketUri = require('./modules/findSocket');
const verifyToken = require('./modules/verifyToken');

const checkGamePin = require('./utils/checkGamePin');
const serverCodes = require('./utils/serverCodes');
const getGameData = require('./utils/getGameData');
const isFavorited = require('./utils/isFavorited');
const getRandomBlook = require('./utils/getRandomBlook');

class Blooket extends EventEmitter {
    constructor() {
        super();
    };

    /* Global */

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

    async createGame(hostName, isPlus, qSetId, newDateString, t_a /* t_a = Time or Amount*/, gameMode, authToken) {
        const createGameResponse = await axios.post(utils.links.live, {
            hoster: hostName,
            plus: isPlus,
            qSetId: qSetId,
            settings: {
                d: newDateString,
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

        const ranges = serverCodes();

        ranges.forEach(async range => {
            const socketUrl = await findSocketUri(range.code);

            const ws = new WebSocket(socketUrl);

            ws.on('open', () => {
                ws.send(messages.authorize(verifyTokenReponse.data.idToken));
                ws.send(JSON.stringify({ "t": "d", "d": { "r": 3, "a": "p", "b": { "p": "/" + createGameResponse.data.id, "d": { "ho": hostName, "p": isPlus, "s": { "d": newDateString, "la": true, "m": t_a, "t": gameMode }, "set": qSetId, "stg": "join" } } } }))
            });
        });

        const data = createGameResponse.data.id;

        this.emit('gameCreated', data);
    };

    async getAccountData(authToken) {
        const modifiedAuthToken = authToken.split('JWT ')[1];

        const response = await axios(utils.links.verifyAcc + modifiedAuthToken);

        const message = response.data

        this.emit('accountData', message);
    };

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

            const message = response.data

            this.emit('gameData', message);

        } else {
            throw new Error('Invalid Game Pin provided');
        };
    };

    async getAnswers(setId) {
        const response = await axios(utils.links.gameQuery + setId, {}, {
            headers: {
                Referer: 'https://www.blooket.com/',
            },
        });

        response.data.questions.forEach(question => {
            const data = {
                question: question.question,
                answer: question.correctAnswers,
            };

            this.emit('answers', data);
        });
    };

    async spamPlayGame(setId, name, authToken, amount) {

        for (let i = 0; i < amount; i++) {
            const response = await axios.post(utils.links.history, {
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

            if (response.status != 200) {
                console.log('An error occured');
            };

            this.emit('spamPlays');
        };
    };

    async favoriteSet(setId, name, authToken) {
        const checkIfFavorited = await isFavorited(setId, authToken);

        if (checkIfFavorited == false) {
            await axios.put(utils.links.favorite, {
                id: setId,
                isUnfavoriting: false,
                name: name,
            }, {
                headers: {
                    authorization: authToken,
                },
            });

            this.emit('favorited', { set: setId });
        } else {
            throw new Error('You already have this game favorited!');
        };
    };

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

        this.emit('setCreated', response.data);
    };

    async deleteSet(setId, authToken) {
        try {
            const response = await axios.delete(utils.links.gameQuery + setId, {}, {
                headers: {
                    authorization: authToken,
                },
            });

            this.emit('setDeleted', response.data);
        } catch (e) {
            if (e.response.status != 200) {
                throw new Error("You don't own this set!");
            };
        };
    };

    async addTokens(tokenAmount, xpAmount, name, authToken) {
        await axios.put(utils.links.rewards, {
            addedTokens: tokenAmount,
            addedXp: xpAmount,
            name: name,
        }, {
            headers: {
                authorization: authToken,
            }
        });

        this.emit('tokensAdded');
    };

    /* Global End */

    /* Gold Quest */

    async stealGold(gamePin, victimName) {
        const botName = "hecker" + Math.floor(100 + Math.random() * 900).toString();
        const randomBlook = getRandomBlook();

        const socketAuthToken = await verifyToken(gamePin, botName);
        const game = await getGameData(gamePin, botName);

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
                    ws.send(messages.gold.steal(gamePin, botName, randomBlook, victimName))
                });
            });
        };


        this.emit('goldStolen', { player: victimName });
    };

    async giveGold(gamePin, victimName) {
        const botName = "hecker" + Math.floor(100 + Math.random() * 900).toString();
        const randomBlook = getRandomBlook();

        const socketAuthToken = await verifyToken(gamePin, botName);
        const game = await getGameData(gamePin, botName);

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
                    ws.send(messages.gold.give(gamePin, botName, randomBlook, victimName))
                });
            });
        };

        this.emit('goldGiven', { player: victimName });
    };

    /* Gold Quest End */

    /* Racing */

    async endGame(gamePin) {
        const botName = "hecker" + Math.floor(100 + Math.random() * 900).toString();
        const randomBlook = getRandomBlook();

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