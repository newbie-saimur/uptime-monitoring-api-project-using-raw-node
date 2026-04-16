/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */

// Dependencies
const lib = require('../../lib/data');
const { parseJSON, hash, generateRandomString } = require('../../helpers/utilities');

// Module Scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) >= 0) {
        handler._token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._token = {};

handler._token.post = (requestProperties, callback) => {
    const phone = typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
    const password = typeof requestProperties.body.password === 'string' && requestProperties.body.password.length > 0 ? requestProperties.body.password : false;
    if (phone && password) {
        lib.read('users', phone, (readingError, userData) => {
            if (!readingError && userData) {
                const user = parseJSON(userData);
                if (user.password === hash(password)) {
                    const token = generateRandomString(20);
                    const expires = Date.now() + 24 * 60 * 60 * 1000;
                    const tokenObject = {
                        token,
                        phone,
                        expires,
                    };
                    lib.create('tokens', token, tokenObject, (writingError) => {
                        if (!writingError) {
                            callback(200, {
                                message: 'User token created successfully!',
                                body: tokenObject,
                            });
                        } else {
                            callback(500, {
                                error: 'There was an error while saving the user token!',
                            });
                        }
                    });
                } else {
                    callback(400, {
                        error: 'Password or phone number is invalid!',
                    });
                }
            } else {
                callback(400, {
                    error: 'There is a problem with your request!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'There is a problem in your request',
        });
    }
};
// handler._token.get = (requestProperties, callback) => {};
// handler._token.put = (requestProperties, callback) => {};
// handler._token.delete = (requestProperties, callback) => {};

module.exports = handler;
