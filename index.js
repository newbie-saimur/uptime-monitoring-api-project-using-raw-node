// Dependencies
const http = require('http');

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
app.handleReqRes = (req, res) => {
    res.end('Hello World!');
};

// Start the Server
app.createServer();
