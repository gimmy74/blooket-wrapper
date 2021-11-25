# blooket

Documentation for the node.js Blooket library

## Documentation

- [Basic Usage](https://github.com/glixzzy/blooket-wrapper/blob/main/Documention.md#basic-usage)
- [Functions](https://github.com/glixzzy/blooket-wrapper/blob/main/Documention.md#functions)
- [Events](https://github.com/glixzzy/blooket-wrapper/blob/main/Documention.md#events)

### Basic Usage
```js
const Blooket = require('blooket')

const client = new Blooket();

client.joinGame('342865', 'twst', 'Dog')

client.on('Joined', data => {
    console.log(`Joined game with name: ${data.name} \nJoined game with blook: ${data.blook}`)
});
```

## Functions
- **`addTokens(tokenAmount, xpAmount, blooketName, blooketAuthToken)`** - Adds tokens and XP to your account
#### Parameters:
| name | description |
|-|-|
|*tokenAmount*|Amount of tokens you want (max 500 allowed) - **Number**|
|*xpAmount*|Amount of XP you want (max 300 allowed) - **Number**|
|*blooketName*|Your Blooket account name - **String**|
|*blooketAuthToken*|Your auth token is like your login info - **String**|

Example:
```js
const Blooket = require('blooket')

const client = new Blooket();

const authToken = ""; // put your blooket auth token

client.getAccountData(authToken);

client.on('accountData', data => {
    const name = data.name;
    const tokenAmount = 500;
    const xpAmount = 300;

    client.addTokens(tokenAmount, xpAmount, name, authToken);

    client.on('tokensAdded', () => {
        console.log(`${tokenAmount} tokens and ${xpAmount} XP added to your account!`);
    });
});
```

- **`createGame(hostName, isPlus, gameSetId, newDateISOString, t_a, gameMode, blooketAuthToken)`**
### Parameters:
| name | description |
|-|-|
|*hostName*|Your Blooket Name - **String**|
|*isPlus*|Does your Blooket account have plus? - **`true` or `false`**|
|*gameSetId*|game set Id used to create a game - **String**|
|*newDateISOString*|new date turned into a ISOString - **String**|
|*t_a*|t = Time or a = Amount - **`Time` or `Amount`**|
|*blooketAuthToken*|Your auth token is like your login info - **String**|

Example:
```js
const Blooket = require('blooket');

const client = new Blooket();

const authToken = "" /* put your blooket auth token */

client.getAccountData(authToken);

client.on('accountData', message => {
    const hostName = message.name
    const isPlus = message.plan == 'Starter' ? false : true
    const gameSetId = "600b1491d42a140004d5215a"
    const newDateISOString = new Date().toISOString();

    client.createGame(hostName, isPlus, gameSetId, newDateISOString, 'Time', 'Gold', authToken)

    client.on('gameCreated', data => {
        console.log("Game Created: " + data)
    });
});
```

- **`createSet(authorName, description, isPrivate, title, blooketAuthToken)`**
### Parameters:
| name | description |
|-|-|
|*authorName*|Your Blooket name - **String**|
|*description*|Write description about the game set - **String**|
|*isPrivate*|Set your game to private - **`true` or `false`**|
|*title*|Set a title for your game set - **String**|
|*blooketAuthToken*|Your auth token is like your login info - **String**|

Example:
```js
const Blooket = require('blooket')

const client = new Blooket();

const authToken = ""; // put your blooket auth token

client.getAccountData(authToken);

client.on('accountData', data => {
    const author = data.name;
    const desc = 'created from nodejs';
    const isPrivate = false;
    const title = 'created from nodejs';

    client.createSet(author, desc, isPrivate, title, authToken);

    client.on('setCreated', message => {
        console.log(message);
    });
});
```

- **``deleteSet(setId, blooketAuthToken)``**
### Parameters:
| name | description |
|-|-|
|*setId*|Game set Id - **String**|
|*blooketAuthToken*|Your auth token is like your login info - **String**|

Example:
```js
const Blooket = require('blooket')

const client = new Blooket();

const authToken = ""; // put your blooket auth token

client.deleteSet('5fda2c0b4736cc0004ac931f', authToken);

client.on('setDeleted', data => {
    console.log(data)
})
```

- **``favoriteSet(setId, blooketName, blooketAuthToken)``**
### Parameters:
| name | description |
|-|-|
|*setId*|Game set Id - **String**|
|*blooketName*|Your Blooket account name - **String**|
|*blooketAuthToken*|Your auth token is like your login info - **String**|

Example:
```js
const Blooket = require('blooket')

const client = new Blooket();

const authToken = ""; // put your blooket auth token

client.getAccountData(authToken);

client.on('accountData', data => {
    const name = data.name;

    client.favoriteSet('600b1491d42a140004d5215a', name, authToken) //https://www.blooket.com/set/600b1491d42a140004d5215a

    client.on('favorited', message => {
        console.log('Favorited set: ' + message.set);
    });
});
```

- **``floodGames(gamePin, amount)``**
### Parameters:
| name | description |
|-|-|
|*gamePin*|Game pin to join a game - **String**|
|*amount*|Amount of bots you want to send - **Number**|

Example:
```js
const Blooket = require('blooket')

const client = new Blooket();

client.floodGames('972506', 100);

client.on('flood', data => {
    console.log('Joined game with name: ' + data.player);
});
```

- **`getAnswers(setId)`**
### Parameters:
| name | description |
|-|-|
|*setId*|Game set Id - **String**|

Example:
```js
const Blooket = require('blooket')

const client = new Blooket();

client.getGameData('223669');

client.on('gameData', data => {
    const setId = data.host.set

    client.getAnswers(setId);
    
    client.on('answers', message => {
        console.log('Question: ' + message.question + ' | Answer: ' + message.answer[0]);
    });
});
```

- **`joinGame(gamePin, botName, blook)`**
### Parameters:
| name | description |
|-|-|
|*gamePin*|Game pin used to join a game - **String**|
|*botName*|Bot name used to join a game - **String**|
|*blook*|Blook used to play a game - **String**|

Example:
```js
const Blooket = require('blooket')

const client = new Blooket();

client.joinGame('342865', 'twst', 'Dog')

client.on('Joined', data => {
    console.log(`Joined game with name: ${data.name} \nJoined game with blook: ${data.blook}`)
});
```

- **`spamPlayGame(setId, blooketName, blooketAuthToken, amount)`**
### Parameters:
| name | description |
|-|-|
|*setId*|Game set Id - **String**|
|*blooketName*|Your Blooket account name - **String**|
|*blooketAuthToken*|Your auth token is like your login info - **String**|
|*amount*|Amount of bots you want to send - **Number**|

Example:
```js
const Blooket = require('blooket')

const client = new Blooket();

const authToken = ""; // put your blooket auth token

client.getAccountData(authToken);

client.on('accountData', data => {
    
    const setId = "600b1491d42a140004d5215a"; // https://www.blooket.com/set/600b1491d42a140004d5215a
    const accountName = data.name;

    client.spamPlayGame(setId, accountName, authToken, 100);

    client.on('spamPlays', () => {
        console.log('Game played!')
    });
});
```

- **``giveGold(gamePin, playerName)``**
### Parameters:
| name | description |
|-|-|
|*gamePin*|Game pin used to join a game with - **String**|
|*playName*|Player name to give gold to - **String**|

**Note: This function only works for gold quest game mode!**

Example:
```js
const Blooket = require('blooket');

const client = new Blooket();

client.giveGold('189789', 'glizzy');

client.on('goldGiven', data => {
    console.log('Gold given to player: ' + data.player);
});
```

- **``stealGold(gamePin, playerName)``**
### Parameters:
| name | description |
|-|-|
|*gamePin*|Game pin used to join a game with - **String**|
|*playName*|Player name to steal gold from - **String**|

**Note: This function only works for gold quest game mode!**

Example:
```js
const Blooket = require('blooket');

const client = new Blooket();

client.stealGold('773710', 'glixzzy');

client.on('goldStolen', data => {
    console.log('Gold stolen from player: ' + data.player);
});
```

- **``endGame(gamePin)``**
### Parameters:
| name | description |
|-|-|
|*gamePin*|Game pin used to join a game with - **String**|

**Note: This function only works for racing game mode!**

Example:
```js
const Blooket = require('blooket');

const client = new Blooket();

client.endGame('861432');

client.on('gameEnded', data => {
    console.log('Ended game: ' + data.pin);
});
```

## Events

`tokensAdded` - [addTokens()](https://github.com/glixzzy/blooket-wrapper/blob/main/Documention.md#parameters)

- Emitted when then client adds tokens and XP to their account.

`gameCreated` - [createGame()](https://github.com/glixzzy/blooket-wrapper/blob/main/Documention.md#parameters-1)

- Emitted when the client creates a live game.
    - Returns an `Object`

`setCreated` - [createSet()](https://github.com/glixzzy/blooket-wrapper/blob/main/Documention.md#parameters-2)

- Emitted when the client creates a set.
    - Returns an `Object`

`setDeleted` - [deleteSet()](https://github.com/glixzzy/blooket-wrapper/blob/main/Documention.md#parameters-3)

- Emitted when the client deletes a set.
    - Returns an `Object`

`favorited` - [favoriteSet()](https://github.com/glixzzy/blooket-wrapper/blob/main/Documention.md#parameters-4)

- Emitted when the client favorites a set.
    - Returns an `Object`

`flood` - [floodGames()](https://github.com/glixzzy/blooket-wrapper/blob/main/Documention.md#parameters-5)

- Emitted when the client flood a game.
    - Returns an `Object`


`answers` - [getAnswers()](https://github.com/glixzzy/blooket-wrapper/blob/main/Documention.md#parameters-6)

- Emitted when the client gets answers for a game.
    - Returns an `Object` and `Array`

`Joined` - [joinGame()](https://github.com/glixzzy/blooket-wrapper/blob/main/Documention.md#parameters-7)

- Emitted when the client joins a game.
    - Returns an `Object`

`spamPlays` - [spamPlayGame()](https://github.com/glixzzy/blooket-wrapper/blob/main/Documention.md#parameters-8)

- Emitted when the client spam plays a game.

`goldGiven` - [giveGold()](https://github.com/glixzzy/blooket-wrapper/blob/main/Documention.md#parameters-9)

- Emitted when the client gives gold to a user.
    - Returns an `Object`

`goldStolen` - [stealGold()](https://github.com/glixzzy/blooket-wrapper/blob/main/Documention.md#parameters-10)

- Emitted when the client steal gold from a player.
    - Returns an `Object`

`gameEnded` - [endGame()](https://github.com/glixzzy/blooket-wrapper/blob/main/Documention.md#parameters-11)

- Emitted when the client ends a game.
    - Returns an `Object`