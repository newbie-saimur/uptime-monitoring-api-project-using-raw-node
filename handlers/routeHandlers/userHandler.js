/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
// Dependencies
const lib = require('../../lib/data');
const { hash, parseJSON } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');

const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._users = {};

handler._users.post = (requestProperties, callback) => {
    const firstName = typeof requestProperties.body.firstName === 'string'
        && requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName.trim()
            : '';

    const lastName = typeof requestProperties.body.lastName === 'string'
        && requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName.trim()
            : '';

    const phone = typeof requestProperties.body.phone === 'string'
        && requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone.trim()
            : '';

    const password = typeof requestProperties.body.password === 'string'
        && requestProperties.body.password.length > 0
            ? hash(requestProperties.body.password)
            : '';

    const tosAgreement = typeof requestProperties.body.tosAgreement === 'boolean'
        && requestProperties.body.tosAgreement === true
            ? requestProperties.body.tosAgreement
            : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // Check if the user already exist
        lib.read('users', phone, (err) => {
            if (err) {
                const userObject = {
                    firstName,
                    lastName,
                    phone,
                    password,
                    tosAgreement,
                };

                // Create new user and store the user in the users directory
                lib.create('users', phone, userObject, (err2) => {
                    if (!err2) {
                        tokenHandler._token.post(requestProperties, (statusCode, { body }) => {
                            if (statusCode && body.token) {
                                callback(200, {
                                    message: 'User was created successfully',
                                    token: body.token,
                                });
                            } else {
                                callback(200, {
                                    message: 'User was created successfully',
                                });
                            }
                        });
                    } else {
                        callback(500, {
                            error: 'Could not create user!',
                        });
                    }
                });
            } else {
                callback(500, {
                    error: 'There was a problem in server side',
                });
            }
        });
    } else {
        callback(400, {
            error: 'The user is already registered!',
        });
    }
};

handler._users.get = (requestProperties, callback) => {
    const phone = typeof requestProperties.queryStringObject.phone === 'string'
        && requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone.trim()
            : '';
    if (phone) {
        const token = typeof requestProperties.headersObject.token === 'string' && requestProperties.headersObject.token.length === 20 ? requestProperties.headersObject.token : false;

        tokenHandler._token.verify(token, phone, (isValid) => {
            if (isValid) {
                lib.read('users', phone, (err, userData) => {
                    if (!err && userData) {
                        const user = { ...parseJSON(userData) };
                        delete user.password;
                        callback(200, user);
                    } else {
                        callback(404, {
                            error: 'Requested user was not found!',
                        });
                    }
                });
            } else {
                callback(403, {
                    error: 'Authentication Failure!',
                });
            }
        });
    } else {
        callback(404, {
            error: 'Requested user was not found!',
        });
    }
};

handler._users.put = (requestProperties, callback) => {
    const firstName = typeof requestProperties.body.firstName === 'string'
        && requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName.trim()
            : '';

    const lastName = typeof requestProperties.body.lastName === 'string'
        && requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName.trim()
            : '';

    const phone = typeof requestProperties.body.phone === 'string'
        && requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone.trim()
            : '';

    const password = typeof requestProperties.body.password === 'string'
        && requestProperties.body.password.length > 0
            ? hash(requestProperties.body.password)
            : '';

    if (phone) {
        const token = typeof requestProperties.headersObject.token === 'string' && requestProperties.headersObject.token.length === 20 ? requestProperties.headersObject.token : false;

        tokenHandler._token.verify(token, phone, (isValid) => {
            if (isValid) {
                lib.read('users', phone, (err, userData) => {
                    if (!err && userData) {
                        const user = { ...parseJSON(userData) };
                        if (firstName) {
                            user.firstName = firstName;
                        }
                        if (lastName) {
                            user.lastName = lastName;
                        }
                        if (password) {
                            user.password = password;
                        }
                        lib.update('users', phone, user, (err1) => {
                            if (!err1) {
                                callback(200, {
                                    message: 'User was updated successfully!',
                                });
                            } else {
                                callback(500, {
                                    error: 'Something went wrong. Try Again!',
                                });
                            }
                        });
                    } else {
                        callback(500, {
                            error: 'Invalid phone number. Please try again!',
                        });
                    }
                });
            } else {
                callback(403, {
                    error: 'Authentication Failure!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'Invalid phone number. Please try again!',
        });
    }
};

handler._users.delete = (requestProperties, callback) => {
    const phone = typeof requestProperties.queryStringObject.phone === 'string'
        && requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone.trim()
            : '';
    if (phone) {
        const token = typeof requestProperties.headersObject.token === 'string' && requestProperties.headersObject.token.length === 20 ? requestProperties.headersObject.token : false;

        tokenHandler._token.verify(token, phone, (isValid) => {
            if (isValid) {
                lib.read('users', phone, (err, userData) => {
                    if (!err && userData) {
                        lib.delete('users', phone, (err2) => {
                            if (!err2) {
                                tokenHandler._token.deleteExpired(token);
                                callback(200, {
                                    message: 'The requested user was deleted successfully!',
                                });
                            } else {
                                callback(500, {
                                    error: 'Something went wrong. Try Again!',
                                });
                            }
                        });
                    } else {
                        callback(404, {
                            error: 'Requested user was not found!',
                        });
                    }
                });
            } else {
                callback(403, {
                    error: 'Authentication Failure!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'There is a problem in your request!',
        });
    }
};

module.exports = handler;
