// Dependencies
const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');

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
    // Request Handling
    const parsedUrl = url.parse(req.url, true); // True means allow query params for parsing
    const { path } = parsedUrl;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const queryStringObject = parsedUrl.query;
    const method = req.method.toLowerCase();
    const headersObject = req.headers;

    const decoder = new StringDecoder('utf-8');
    let realData = '';

    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });

    req.on('end', () => {
        realData += decoder.end();
        console.log(realData);
        // Response Handling
        res.end('Hello World!');
    });

    console.log(trimmedPath, method, queryStringObject, headersObject);
};

// Start the Server
app.createServer();
