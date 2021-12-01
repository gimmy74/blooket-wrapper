export = Blooket;
/**
 * new Blooket
 * @class
 * @classdesc Game manipulation & normal API usage
 */
declare class Blooket extends EventEmitter {
    constructor();
    /**
     *
     * @function joinGame
     * @param {string} gamePin - Game pin used to enter in a game
     * @param {string} botName - Name used to join a game
     * @param {string} blook - Blook chosed to play with in a game
     */
    joinGame(gamePin: string, botName: string, blook: string): Promise<void>;
    /**
     *
     * @function floodGames
     * @param {string} gamePin - Game pin used to enter in a game
     * @param {number} amount - Amount of bots you want to flood the game
     */
    floodGames(gamePin: string, amount: number): Promise<void>;
    /**
     *
     * @function createGame
     * @param {string} hostName - Your Blooket name
     * @param {boolean} isPlus - Is your account plus?
     * @param {string} qSetId - Game Set Id
     * @param {t_a} t_a - t = True | a = Amount
     * @param {string} gameMode - Gold, Crypto, and etc.
     * @param {string} authToken - Your auth token is like your login info
     */
    createGame(hostName: string, isPlus: boolean, qSetId: string, t_a: any, gameMode: string, authToken: string): Promise<void>;
    /**
     *
     * @function getAccountData
     * @param {string} authToken - Your auth token is like your login info
     * @returns {Promise} Returns response data
     */
    getAccountData(authToken: string): Promise<any>;
    /**
     *
     * @function getGameData
     * @param {string} gamePin - Game pin used to enter in a game
     * @returns {Promise} Returns response data
     */
    getGameData(gamePin: string): Promise<any>;
    /**
     *
     * @function getAnswers
     * @param {string} gamePin - Game pin used to enter in a game
     * @returns {Promise} Returns response data
     */
    getAnswers(gamePin: string): Promise<any>;
    /**
     *
     * @function spamPlayGame
     * @param {string} setId - Game Set Id
     * @param {string} name - BLooket account name
     * @param {string} authToken - Your Blooket auth token is like your login info
     * @param {number} amount - Amount of plays you want
     */
    spamPlayGame(setId: string, name: string, authToken: string, amount: number): Promise<void>;
    /**
     *
     * @function favoriteSet
     * @param {string} setId - Game Set Id
     * @param {string} name - Blooket account name
     * @param {string} authToken - Your blooket auth token is like your login info
     * @returns {Promise} Returns response data
     */
    favoriteSet(setId: string, name: string, authToken: string): Promise<any>;
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
    createSet(author: string, description: string, isPrivate: boolean, title: string, authToken: string): Promise<any>;
    /**
     *
     * @function addTokens
     * @param {number} tokenAmount - Amount of tokens you want
     * @param {number} xpAmount - Amount of XP you want
     * @param {string} name - Blooket account name
     * @param {string} authToken
     * @returns {Promise} Returns response data
     */
    addTokens(tokenAmount: number, xpAmount: number, name: string, authToken: string): Promise<any>;
    /**
     *
     * @function login
     * @param {string} email - Blooket email used to login
     * @param {string} password - Blooket password used to login
     * @returns {Promise} Returns response data
     */
    login(email: string, password: string): Promise<any>;
    /**
     *
     * @function getHistories
     * @param {string} authToken - Your Blooket auth token is like your login info
     * @returns {Promise} Returns response data
     */
    getHistories(authToken: string): Promise<any>;
    /**
     *
     * @function getHomeworks
     * @param {string} authToken - Your Blooket auth token is like your login info
     * @returns {Promise} Returns response data
     */
    getHomeworks(authToken: string): Promise<any>;
    /**
     *
     * @function deleteHomework
     * @param {setId} setId - Game Set Id
     * @param {string} authToken - Your Blooket auth token is like your login info
     * @returns {Promise} Returns response data
     */
    deleteHomework(setId: any, authToken: string): Promise<any>;
    /**
     *
     * @function getBlooks
     * @param {string} authToken - Your Blooket auth token is like your login info
     * @returns {Promise} Returns response data
     */
    getBlooks(authToken: string): Promise<any>;
    /**
     *
     * @function getTokens
     * @param {string} authToken - Your Blooket auth token is like your login info
     * @returns {Promise} Returns response data
     */
    getTokens(authToken: string): Promise<any>;
    /**
     *
     * @function getStats
     * @param {string} authToken - Your Blooket auth token is like your login info
     * @returns {Promise} Returns response data
     */
    getStats(authToken: string): Promise<any>;
    /**
     *
     * @function getUserData
     * @param {string} name - Blooket account name
     * @param {string} authToken - Your Blooket auth token is like your login info
     * @returns {Promise} Returns response data
     */
    getUserData(name: string, authToken: string): Promise<any>;
    /**
     *
     * @function stealGold
     * @param {string} gamePin - Game pin used to enter a game
     * @param {string} victimName - Player name you want to steal gold from
     */
    stealGold(gamePin: string, victimName: string): Promise<void>;
    /**
     *
     * @function giveGold
     * @param {string} gamePin - Game pin used to enter a game
     * @param {string} victimName - Player name you want to steal gold from
     */
    giveGold(gamePin: string, victimName: string): Promise<void>;
    /**
     *
     * @function endGame
     * @param {string} gamePin - Game pin used to enter a game
     */
    endGame(gamePin: string): Promise<void>;
}
import EventEmitter = require("events");
