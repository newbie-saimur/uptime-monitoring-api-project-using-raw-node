// Dependencies
const http = require('http');
const { handleReqRes } = require('../helpers/handleRegRes');
const environment = require('../helpers/environments');

// App Object - Module Scaffolding
const server = {};

// Create Server
server.createServer = () => {
    const serverVariable = http.createServer(server.handleReqRes);
    serverVariable.listen(environment.port, () => {
        console.log(`Listening to port ${environment.port}`);
    });
};

// Handle Request Response
server.handleReqRes = handleReqRes;

// Start the Server
server.init = () => server.createServer();

module.exports = server;
