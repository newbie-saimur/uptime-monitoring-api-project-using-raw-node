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
    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;
    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.length > 0
            ? requestProperties.body.password
            : false;
    if (phone && password) {
        lib.read('users', phone, (readingError, userData) => {
            if (!readingError && userData) {
                const user = parseJSON(userData);
                if (user.password === hash(password)) {
                    const token = generateRandomString(32);
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

handler._token.get = (requestProperties, callback) => {
    const token =
        typeof requestProperties.queryStringObject.id === 'string'
            ? requestProperties.queryStringObject.id
            : false;
    if (token) {
        lib.read('tokens', token, (readingError, tokenData) => {
            if (!readingError && tokenData) {
                const tokenObject = parseJSON(tokenData);
                if (tokenObject.expires > Date.now()) {
                    callback(200, tokenObject);
                } else {
                    handler._token.deleteExpired(token);
                    callback(400, {
                        error: 'Requested token is already expired. Create a new one!',
                    });
                }
            } else {
                callback(404, {
                    error: 'Requested token is invalid!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'There was an error in your request!',
        });
    }
};

handler._token.put = (requestProperties, callback) => {
    const token =
        typeof requestProperties.body.token === 'string' && requestProperties.body.token.length > 0
            ? requestProperties.body.token
            : false;

    const extend =
        typeof requestProperties.body.extend === 'boolean' ? requestProperties.body.extend : false;

    if (token && extend) {
        lib.read('tokens', token, (readingError, tokenData) => {
            if (!readingError && tokenData) {
                const tokenObject = parseJSON(tokenData);
                if (tokenObject.expires >= Date.now()) {
                    tokenObject.expires = Date.now() + 24 * 60 * 60 * 1000;
                    lib.update('tokens', token, tokenObject, (updateError) => {
                        if (!updateError) {
                            callback(200, {
                                message: 'Token expiry was extended successfully!',
                            });
                        } else {
                            callback(500, {
                                error: 'There was an error in the server side!',
                            });
                        }
                    });
                } else {
                    handler._token.deleteExpired(token);
                    callback(400, {
                        error: 'Token is already expired. Create a new one!',
                    });
                }
            } else {
                callback(404, {
                    error: 'Requested token was invalid!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'There is a problem with your request!',
        });
    }
};

handler._token.delete = (requestProperties, callback) => {
    const token =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.length > 0
            ? requestProperties.queryStringObject.id
            : false;

    if (token) {
        lib.read('tokens', token, (readingError, tokenData) => {
            if (!readingError && tokenData) {
                lib.delete('tokens', token, (deleteError) => {
                    if (!deleteError) {
                        callback(200, {
                            message: 'Requested token deleted successfully!',
                        });
                    } else {
                        callback(500, {
                            error: 'There was an server side error!',
                        });
                    }
                });
            } else {
                callback(404, {
                    error: 'Requested token is not found!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'There is an error in your request',
        });
    }
};

handler._token.deleteExpired = (token) => {
    lib.delete('tokens', token, (deleteError) => {
        if (!deleteError) {
            console.log('Expired token deleted successfully!');
        } else {
            console.log('Expired token can not be deleted!');
        }
    });
};

handler._token.verify = (token, phone, callback) => {
    lib.read('tokens', token, (readingError, tokenData) => {
        if (!readingError && tokenData) {
            if (parseJSON(tokenData).phone === phone && parseJSON(tokenData).expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

module.exports = handler;
