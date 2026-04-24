const lib = require('../../lib/data');
const tokenHandler = require('./tokenHandler');
const { parseJSON, generateRandomString } = require('../../helpers/utilities');

const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) >= 0) {
        handler._check[requestProperties.method](requestProperties, callback);
    } else {
        callback(400, {
            error: 'There is a problem in your request!',
        });
    }
};

handler._check = {};

handler._check.post = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.length === 11
            ? requestProperties.body.phone
            : false;

    const protocol =
        typeof requestProperties.body.protocol === 'string' &&
        ['http', 'https'].indexOf(requestProperties.body.protocol) >= 0
            ? requestProperties.body.protocol
            : false;

    const url =
        typeof requestProperties.body.url === 'string' && requestProperties.body.url.length > 0
            ? requestProperties.body.url
            : false;

    const method =
        typeof requestProperties.body.method === 'string' &&
        ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method.toUpperCase()) >= 0
            ? requestProperties.body.method.toUpperCase()
            : false;

    const successCodes =
        typeof requestProperties.body.successCodes === 'object' &&
        requestProperties.body.successCodes instanceof Array
            ? requestProperties.body.successCodes
            : false;

    const timeoutSeconds =
        typeof requestProperties.body.timeoutSeconds === 'number' &&
        requestProperties.body.timeoutSeconds > 0 &&
        requestProperties.body.timeoutSeconds <= 5
            ? requestProperties.body.timeoutSeconds
            : false;

    if (phone && protocol && url && method && successCodes && timeoutSeconds) {
        lib.read('users', phone, (readingError, userData) => {
            if (!readingError && userData) {
                const token =
                    typeof requestProperties.headersObject.token === 'string' &&
                    requestProperties.headersObject.token.length === 32
                        ? requestProperties.headersObject.token
                        : false;

                tokenHandler._token.verify(token, phone, (isValid) => {
                    if (isValid) {
                        const user = parseJSON(userData);
                        const checks =
                            typeof user.checks === 'object' && user.checks instanceof Array
                                ? user.checks
                                : [];

                        if (checks.length < 5) {
                            const checkId = generateRandomString(32);
                            const checkObject = {
                                checkId,
                                phone,
                                protocol,
                                url,
                                method,
                                successCodes,
                                timeoutSeconds,
                            };

                            lib.create('checks', checkId, checkObject, (writingError) => {
                                if (!writingError) {
                                    user.checks = checks;
                                    user.checks.push(checkId);
                                    lib.update('users', phone, user, (writingError2) => {
                                        if (!writingError2) {
                                            callback(200, {
                                                message: 'Check added successfully!',
                                                checkObject,
                                            });
                                        } else {
                                            callback(500, {
                                                error: 'Something went wrong!',
                                            });
                                        }
                                    });
                                } else {
                                    callback(500, {
                                        error: 'Something went wrong!',
                                    });
                                }
                            });
                        } else {
                            callback(500, {
                                error: 'Maximum checks limit reached!',
                            });
                        }
                    } else {
                        callback(403, {
                            error: 'Authentication failure!',
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
        callback(400, {
            error: 'There is an error in your request!',
        });
    }
};

handler._check.get = (requestProperties, callback) => {
    const checkId =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.length === 32
            ? requestProperties.queryStringObject.id
            : false;

    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
        requestProperties.queryStringObject.phone.length === 11
            ? requestProperties.queryStringObject.phone
            : false;

    const token =
        typeof requestProperties.headersObject.token === 'string' &&
        requestProperties.headersObject.token.length === 32
            ? requestProperties.headersObject.token
            : false;

    if (checkId) {
        tokenHandler._token.verify(token, phone, (isValid) => {
            if (isValid) {
                lib.read('checks', checkId, (readingError, checkData) => {
                    if (!readingError && checkData) {
                        callback(200, {
                            message: 'Check received successfully!',
                            checkData: parseJSON(checkData),
                        });
                    } else {
                        callback(400, {
                            error: 'Check id may not valid!',
                        });
                    }
                });
            } else {
                callback(403, {
                    error: 'Authentication Error!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'There is an error in your request!',
        });
    }
};

handler._check.put = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.length === 11
            ? requestProperties.body.phone
            : false;

    const protocol =
        typeof requestProperties.body.protocol === 'string' &&
        ['http', 'https'].indexOf(requestProperties.body.protocol) >= 0
            ? requestProperties.body.protocol
            : false;

    const url =
        typeof requestProperties.body.url === 'string' && requestProperties.body.url.length > 0
            ? requestProperties.body.url
            : false;

    const method =
        typeof requestProperties.body.method === 'string' &&
        ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method.toUpperCase()) >= 0
            ? requestProperties.body.method.toUpperCase()
            : false;

    const successCodes =
        typeof requestProperties.body.successCodes === 'object' &&
        requestProperties.body.successCodes instanceof Array
            ? requestProperties.body.successCodes
            : false;

    const timeoutSeconds =
        typeof requestProperties.body.timeoutSeconds === 'number' &&
        requestProperties.body.timeoutSeconds > 0 &&
        requestProperties.body.timeoutSeconds <= 5
            ? requestProperties.body.timeoutSeconds
            : false;

    if (phone && (protocol || url || method || successCodes || timeoutSeconds)) {
        lib.read('users', phone, (readingError, userData) => {
            if (!readingError && userData) {
                const token =
                    typeof requestProperties.headersObject.token === 'string' &&
                    requestProperties.headersObject.token.length === 32
                        ? requestProperties.headersObject.token
                        : false;

                tokenHandler._token.verify(token, phone, (isValid) => {
                    if (isValid) {
                        const checkId =
                            typeof requestProperties.queryStringObject.id === 'string' &&
                            requestProperties.queryStringObject.id.length === 32
                                ? requestProperties.queryStringObject.id
                                : false;
                        lib.read('checks', checkId, (readingError2, checkData) => {
                            if (!readingError2 && checkData) {
                                const checkObject = parseJSON(checkData);
                                if (protocol) checkObject.protocol = protocol;
                                if (url) checkObject.url = url;
                                if (method) checkObject.method = method;
                                if (successCodes) checkObject.successCodes = successCodes;
                                if (timeoutSeconds) checkObject.timeoutSeconds = timeoutSeconds;

                                lib.update('checks', checkId, checkObject, (updateError) => {
                                    if (!updateError) {
                                        callback(200, {
                                            message: 'Check was updated successfully!',
                                            checkData: checkObject,
                                        });
                                    } else {
                                        callback(500, {
                                            error: 'There is a problem in the server side!',
                                        });
                                    }
                                });
                            } else {
                                callback(404, {
                                    error: 'Requested check data was not found!',
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
        });
    } else {
        callback(400, {
            error: 'There is a problem in your request!',
        });
    }
};

handler._check.delete = (requestProperties, callback) => {
    const checkId =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.length === 32
            ? requestProperties.queryStringObject.id
            : false;

    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
        requestProperties.queryStringObject.phone.length === 11
            ? requestProperties.queryStringObject.phone
            : false;

    if (phone && checkId) {
        const token =
            typeof requestProperties.headersObject.token === 'string' &&
            requestProperties.headersObject.token.length === 32
                ? requestProperties.headersObject.token
                : false;

        tokenHandler._token.verify(token, phone, (isValid) => {
            if (isValid) {
                lib.read('checks', checkId, (readingError, checkData) => {
                    if (!readingError && checkData) {
                        lib.delete('checks', checkId, (deleteError) => {
                            if (!deleteError) {
                                lib.read('users', phone, (readingError2, userData) => {
                                    if (!readingError2 && userData) {
                                        const user = parseJSON(userData);
                                        user.checks.splice(checkId, 1);

                                        lib.update('users', phone, user, (updateError) => {
                                            if (!updateError) {
                                                callback(200, {
                                                    message:
                                                        'Requested check was deleted successfully!',
                                                });
                                            } else {
                                                callback(500, {
                                                    error: 'There was a server side error while updating the user data!',
                                                });
                                            }
                                        });
                                    } else {
                                        callback(404, {
                                            error: 'User data was not found!',
                                        });
                                    }
                                });
                            } else {
                                callback(500, {
                                    error: 'There was a server side error!',
                                });
                            }
                        });
                    } else {
                        callback(404, {
                            error: 'Requested check was not found!',
                        });
                    }
                });
            } else {
                callback(403, {
                    error: 'Authentication failure!',
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
