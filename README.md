# blooket-wrapper

A node.js wrapper for the Blooket API

The documentation can be found [here](https://github.com/glixzzy/blooket-wrapper/blob/main/Documention.md)

# Usage

```js
const Blooket = require('blooket');

const client = new Blooket();

client.floodGames('696185', 100);

client.on('flood', data => {
    console.log('Joined game with name: ' + data.player);
});
```