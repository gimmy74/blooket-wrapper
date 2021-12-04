# blooket-wrapper

[![Downloads](https://img.shields.io/npm/dm/blooket.svg?style=flat-square)](https://npmjs.org/package/blooket)

## About
A node.js wrapper for the Blooket API

The documentation can be found [here](https://github.com/glixzzy/blooket-wrapper/blob/main/Documentation.md)

## Installation

```sh-session
npm install blooket
```

# Usage

```js
const Blooket = require('blooket')

const client = new Blooket();

client.joinGame('342865', 'twst', 'Dog')

client.on('Joined', data => {
    console.log(`Joined game with name: ${data.name} \nJoined game with blook: ${data.blook}`)
});
```