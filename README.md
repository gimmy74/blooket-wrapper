# blooket-wrapper

A node.js wrapper for the Blooket API

# Usage
```js
const Blooket = require('blooket');

const client = new Blooket();

client.floodGames('696185', 100);

client.on('flood', data => {
    console.log('Joined game with name: ' + data.player);
});
```