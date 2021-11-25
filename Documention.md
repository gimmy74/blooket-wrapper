# Features
- Add Tokens
- Create Game
- Create Set
- Delete Set 
- Favorite Set
- Flood Games
- Get Answers
- Join Game
- Spam Plays

    - Gold
        - Give Gold
        - Steal Gold
    - Racing
        - End Game

# Documentation

**Installing**:

Run `npm install blooket`

## Functions
- `addTokens(tokenAmount, xpAmount, blooketName, blooketAuthToken)`

    ##### Description: This function adds tokens and XP to your Blooket account.

`tokenAmount` - Integer

`xpAmount` - Integer

`blooketName` - String

`blooketAuthToken` - String

- `createGame(hostName, isPlus, gameSetId, dateISOString, t_a, gameMode, blooketAuthToken)`

    ##### Description: This function creates a live game on Blooket.

`hostName` - String

`isPlus` - `true` or `false`

`gameSetId` - String

`dateISOString` - String

`t_a` - `Time` or `Amount`

`gameMode` - String

`blooketAuthToken` - String

- `createSet(authorName, description, isPrivate, title, blooketAuthToken)`

    ##### Description: This function creates a game set on Blooket.

`authorName` - String

`description` - String

`isPrivate` - `true` or `false`

`title` - String

`blooketAuthToken` - String

- `deleteSet(setId, blooketAuthToken)`

    ##### Description: This function deletes a game set on Blooket.

`setId` - String

`blooketAuthToken` - String

- `favoriteSet(setId, blooketName, blooketAuthToken)`

    ##### Description: This function favorites a game set on Blooket.

`setId` - String

`blooketName` - String

`blooketAuthToken` - String

- `floodGames(gamePin, amount)`

    ##### Description: This function floods a game with bots.

`gamePin` - String

`amount` - Integer

- `getAnswers(setId)`

    ##### Description: This function gets all the answers for a live game.

`setId` - String

- `joinGame(gamePin, botName, blook)`

    ##### Description: This function joins a live game.

`gamePin` - String

`botName` - String

`blooket` - String

- `spamPlayGames(setId, blooketName, blooketAuthToken, amount)`

    ##### Description: This function mass plays a game.

`setId` - String

`blooketName` - String

`blooketAuthToken` - String

`amount` - Integer