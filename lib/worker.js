const http = require('http');
const https = require('https');
const url = require('url');
const lib = require('./data');
const { parseJSON } = require('../helpers/utilities');
const notifications = require('../helpers/notification');

const worker = {};

worker.updateCheckOutcome = (checkData, checkOutcome) => {
    const currentState =
        !checkOutcome.error &&
        checkOutcome.statusCode &&
        checkData.successCodes.indexOf(checkOutcome.statusCode) >= 0
            ? 'up'
            : 'down';

    const needAlert = !!(currentState !== checkData.state && checkData.lastChecked > 0);

    const newCheckData = checkData;
    newCheckData.state = currentState;
    newCheckData.lastChecked = Date.now();

    lib.update('checks', checkData.checkId, newCheckData, (error) => {
        if (!error) {
            if (needAlert) {
                notifications.sendTwilioSms(
                    checkData.phone,
                    `State changed for ${checkData.url} from ${currentState === 'down' ? 'up' : 'down'} to ${currentState}`,
                    (err) => {
                        if (err) {
                            console.log(err);
                        }
                    },
                );
            }
        } else {
            console.log('Error trying to update one of the checks!');
        }
    });
};

worker.performTheCheck = (checkData, requestDetails) => {
    const checkOutcome = {
        error: false,
        value: false,
        statusCode: false,
    };

    let outcomeSent = false;

    const protocolToUse = checkData.protocol === 'http' ? http : https;

    const req = protocolToUse.request(requestDetails, (res) => {
        const { statusCode } = res;
        if (!outcomeSent) {
            checkOutcome.statusCode = statusCode;
            worker.updateCheckOutcome(checkData, checkOutcome);
            outcomeSent = true;
        }
    });

    req.on('error', (error) => {
        if (!outcomeSent) {
            checkOutcome.error = true;
            checkOutcome.value = error;
            worker.updateCheckOutcome(checkData, checkOutcome);
            outcomeSent = true;
        }
    });

    req.on('timeout', () => {
        if (!outcomeSent) {
            checkOutcome.error = true;
            checkOutcome.value = 'Timeout';
            worker.updateCheckOutcome(checkData, checkOutcome);
            outcomeSent = true;
        }
    });

    req.end();
};

worker.processTheCheck = (checkData) => {
    const parsedUrl = url.parse(`${checkData.protocol}://${checkData.url}`, true);
    const { hostname, path } = parsedUrl;

    const requestDetails = {
        protocol: `${checkData.protocol}:`,
        hostname,
        path,
        method: checkData.method.toUpperCase(),
        timeout: checkData.timeoutSeconds * 1000,
    };

    worker.performTheCheck(checkData, requestDetails);
};

worker.validateCheckData = (originalCheckData) => {
    const checkData = originalCheckData;
    checkData.state =
        typeof checkData.state === 'string' && ['up', 'down'].indexOf(checkData.state) >= 0
            ? checkData.state
            : 'down';
    checkData.lastChecked =
        typeof checkData.lastChecked === 'number' && checkData.lastChecked > 0
            ? checkData.lastChecked
            : false;

    worker.processTheCheck(checkData);
};

worker.gatherAllChecks = () => {
    lib.list('checks', (error, checks) => {
        if (!error && checks) {
            checks.forEach((check) => {
                lib.read('checks', check, (readingError, checkData) => {
                    if (!readingError && checkData) {
                        worker.validateCheckData(parseJSON(checkData));
                    } else {
                        console.log('Error reading the check data!');
                    }
                });
            });
        } else {
            console.log('Error: Could not find any check to process!');
        }
    });
};

worker.loop = () => {
    setInterval(() => {
        worker.gatherAllChecks();
    }, 1000 * 60);
};

worker.init = () => {
    worker.gatherAllChecks();
    worker.loop();
};

module.exports = worker;
