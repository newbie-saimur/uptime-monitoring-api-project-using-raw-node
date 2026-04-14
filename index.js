// Dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleRegRes');

// App Object - Module Scaffolding
const app = {};

// Configuration
app.config = {
    port: 3000,
};

// Create Server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`Listening to port ${app.config.port}`);
    });
};

// Handle Request Response
app.handleReqRes = handleReqRes;

// Start the Server
app.createServer();
