const crypto = require('crypto');
const environment = require('./environments');

const utilities = {};

// Parse JSON string to Object
utilities.parseJSON = (jsonString) => {
    let output;
    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }
    return output;
};

// Hash the string
utilities.hash = (stringData) => {
    if (typeof stringData === 'string' && stringData.length > 0) {
        const hash = crypto
            .createHmac('sha256', environment.secretKey)
            .update(stringData)
            .digest('hex');
        return hash;
    }
    return false;
};

// Generate Random String
utilities.generateRandomString = (stringLength) => {
    const possibleCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const { length } = possibleCharacters;
    if (typeof stringLength === 'number' && stringLength > 0) {
        let randomString = '';
        for (let i = 0; i < stringLength; i += 1) {
            const randomNumber = Math.floor(Math.random() * length);
            randomString += possibleCharacters.charAt(randomNumber);
        }
        return randomString;
    }
    return false;
};

module.exports = utilities;
