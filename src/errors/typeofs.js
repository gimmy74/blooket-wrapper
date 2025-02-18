const errors = require('./errors');

function checkPinType(gamePin) {
    if (typeof gamePin == 'number') {
        throw new TypeError(errors.typeofs.gamePin)
    };
};

function checkNameType(name) {
    if (typeof name != 'string') {
        throw new TypeError(errors.typeofs.name);
    };
};

function checkAmountType(amount) {
    if (typeof amount != 'number') {
        throw new TypeError(errors.typeofs.amount);
    };
}

module.exports = { checkPinType, checkNameType, checkAmountType };