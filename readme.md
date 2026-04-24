# 🚀 Uptime Monitoring API

[![GitHub](https://img.shields.io/badge/GitHub-newbie--saimur-blue?style=flat&logo=github)](https://github.com/newbie-saimur/uptime-monitoring-api-project-using-raw-node)
[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green?style=flat&logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat)](#)

A **production-ready uptime monitoring system** built entirely with **raw Node.js** (no frameworks, no dependencies beyond essentials). Monitor URL availability in real-time, receive SMS alerts on status changes, and manage monitoring checks with a REST API.

> Built for learning and production use - demonstrates advanced Node.js patterns including file-based persistence, background workers, and HTTP/HTTPS request handling.

---

## ✨ Key Features

- **🔍 Real-time URL Monitoring** - Continuously monitor multiple URLs for uptime
- **📱 SMS Alerts** - Get instant Twilio SMS notifications when status changes
- **👤 User Management** - Create accounts with phone number verification
- **🔐 Token Authentication** - Secure token-based API access
- **📊 Check Management** - Create, read, update, delete monitoring checks
- **⚙️ Background Worker** - Automated checks every 60 seconds (configurable)
- **💾 File-Based Database** - JSON persistence (no external DB required)
- **🌍 Environment Support** - Staging (dev) and Production modes
- **🛡️ Input Validation** - Comprehensive request validation
- **🔄 State Tracking** - Detects status transitions and triggers alerts

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Running the Project](#running-the-project)
6. [API Endpoints](#api-endpoints)
7. [Usage Examples](#usage-examples)
8. [Project Architecture](#project-architecture)
9. [Database Schema](#database-schema)
10. [Development](#development)
11. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

```bash
# 1. Clone and install
git clone https://github.com/newbie-saimur/uptime-monitoring-api-project-using-raw-node.git
cd uptime-monitoring-api-project-using-raw-node
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your Twilio credentials

# 3. Start development server
npm start

# Server runs on http://localhost:3000 (staging)
```

---

## 📦 Prerequisites

| Requirement    | Version | Notes                                        |
| -------------- | ------- | -------------------------------------------- |
| Node.js        | 14.0+   | [Download](https://nodejs.org/)              |
| npm            | 6.0+    | Comes with Node.js                           |
| Twilio Account | Free    | [Sign up](https://www.twilio.com/try-twilio) |
| Text Editor    | Any     | VS Code recommended                          |
| HTTP Client    | Any     | curl, Postman, or similar                    |

---

## 📥 Installation

### Step 1: Clone Repository

```bash
git clone https://github.com/newbie-saimur/uptime-monitoring-api-project-using-raw-node.git
cd uptime-monitoring-api-project-using-raw-node
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:

**Production Dependencies:**

- **dotenv** - Environment variable management
- **twilio** - SMS messaging service
- **cross-env** - Cross-platform environment variables

**Dev Dependencies:**

- **eslint** - Code linting with Airbnb rules
- **prettier** - Code formatting
- **nodemon** - Auto-reload (via npx in scripts)

### Step 3: Set Up Environment Variables

```bash
# Copy example file
cp .env.example .env

# Edit .env with your credentials
```

---

## ⚙️ Configuration

### Environment Variables (.env)

```env
# Twilio Configuration (Required for SMS)
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890

# Optional Settings
QUIET_MODE=true
NODE_ENV=staging
```

### Get Twilio Credentials

1. Go to [Twilio Console](https://www.twilio.com/console)
2. Find your **Account SID** and **Auth Token**
3. Navigate to **Phone Numbers** → Copy your assigned number
4. Add them to `.env`

### Environment Modes

#### Staging (Development)

```bash
npm start
```

- **Port**: 3000
- **nodemon**: Enabled (auto-reload)
- **Logging**: Verbose (unless QUIET_MODE=true)
- **Secret Key**: Development key

#### Production

```bash
npm run production
```

- **Port**: 5000
- **nodemon**: Enabled (can disable if needed)
- **Logging**: Minimal
- **Secret Key**: Production key

---

## 🏃 Running the Project

### Development

```bash
npm start
# Output: Listening to port 3000
```

### Production

```bash
npm run production
# Output: Listening to port 5000
```

### What Starts

60
When you run either command:

1. **HTTP Server** - Listens on configured port
2. **Background Worker** - Checks each monitoring check every 5 seconds
3. **Data Persistence** - Manages `.data/` directory

```
Server initialized ✓
Worker initialized ✓
Ready to accept requests
```

---

## 📡 API Endpoints

### Base URL

```
http://localhost:3000  (Staging)
http://localhost:5000  (Production)
```

### Authentication

Most endpoints require a token. Include in request URL:

```
?token=your_token_here
```

---

### 1. Sample (Health Check)

#### GET /sample

Quick health check - no authentication needed.

**Request:**

```bash
curl http://localhost:3000/sample
```

**Response:**

```json
{
    "message": "Sample endpoint"
}
```

---

### 2. User Management

#### POST /user

Create a new user account.

**Request Body:**

```json
{
    "firstName": "John",
    "lastName": "Doe",
    "phone": "01234567890",
    "password": "securePassword123",
    "tosAgreement": true
}
```

**Response (201 Created):**

```json
{
    "message": "User created successfully"
}
```

**Validation Rules:**

- firstName: string, non-empty
- lastName: string, non-empty
- phone: exactly 11 digits (Bangladesh format: 01XXXXXXXXX)
- password: non-empty string (hashed before storage)
- tosAgreement: must be true

---

#### GET /user

Retrieve user details (requires token).

**Request:**

```bash
curl "http://localhost:3000/user?token=abc123def456"
```

**Response (200):**

```json
{
    "firstName": "John",
    "lastName": "Doe",
    "phone": "01234567890"
}
```

---

#### PUT /user

Update user information (requires token).

**Request Body:**

```json
{
    "firstName": "John",
    "lastName": "Smith",
    "password": "newPassword456"
}
```

**Note:** All fields optional; only provided fields are updated.

---

#### DELETE /user

Delete user account (requires token).

**Request:**

```bash
curl -X DELETE "http://localhost:3000/user?token=abc123def456"
```

**Response (200):**

```json
{
    "message": "User deleted successfully"
}
```

---

### 3. Token Management

#### POST /token

Create authentication token (login).

**Request Body:**

```json
{
    "phone": "01234567890",
    "password": "securePassword123"
}
```

**Response (200):**

```json
{
    "tokenId": "abc123def456xyz789",
    "phoneNumber": "01234567890",
    "expires": 1682380800000
}
```

**Token Details:**

- **Expires**: 1 hour from creation
- **Format**: Random string (20 characters)
- **Used for**: Authentication on protected endpoints

---

#### GET /token

Verify token validity (requires token).

**Request:**

```bash
curl "http://localhost:3000/token?id=abc123def456xyz789"
```

**Response (200):**

```json
{
    "phone": "01234567890",
    "expires": 1682380800000,
    "isExpired": false
}
```

---

#### PUT /token

Extend token expiration (requires token).

**Request Body:**

```json
{
    "id": "abc123def456xyz789",
    "extend": true
}
```

**Response (200):**

```json
{
    "message": "Token extended for 1 hour"
}
```

---

#### DELETE /token

Logout/revoke token (requires token).

**Request:**

```bash
curl -X DELETE "http://localhost:3000/token?id=abc123def456xyz789"
```

---

### 4. Check Management (Monitoring)

#### POST /check

Create a new monitoring check.

**Request Body:**

```json
{
    "protocol": "https",
    "url": "www.google.com",
    "method": "GET",
    "successCodes": [200, 201],
    "timeoutSeconds": 5
}
```

**Required Headers/Query:**

- `token` parameter in URL

**Response (201 Created):**

```json
{
    "message": "Check created successfully",
    "checkId": "unique_check_id_12345"
}
```

**Check Configuration:**

- **protocol**: "http" or "https"
- **url**: Domain/path to monitor (e.g., "example.com/api/health")
- **method**: GET, POST, PUT, or DELETE
- **successCodes**: Array of HTTP status codes considered "up"
- **timeoutSeconds**: Request timeout (typically 3-5 seconds)

---

#### GET /check

Retrieve check details.

**Request:**

```bash
curl "http://localhost:3000/check?id=checkId123&token=userToken"
```

**Response (200):**

```json
{
    "checkId": "checkId123",
    "phone": "01234567890",
    "protocol": "https",
    "url": "www.google.com",
    "method": "GET",
    "successCodes": [200, 201],
    "timeoutSeconds": 5,
    "state": "up",
    "lastChecked": 1682380500000
}
```

---

#### PUT /check

Update a monitoring check.

**Request Body:**

```json
{
    "id": "checkId123",
    "successCodes": [200, 201, 204],
    "timeoutSeconds": 10
}
```

**Note:** Can update any configuration except phone number.

---

#### DELETE /check

Remove a monitoring check.

**Request:**

```bash
curl -X DELETE "http://localhost:3000/check?id=checkId123&token=userToken"
```

---

## 💡 Usage Examples

### Complete Workflow

#### 1. Create User

```bash
curl -X POST http://localhost:3000/user \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "phone": "01234567890",
    "password": "mySecret123",
    "tosAgreement": true
  }'
```

#### 2. Login (Create Token)

```bash
curl -X POST http://localhost:3000/token \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "01234567890",
    "password": "mySecret123"
  }'

# Response includes: tokenId
```

#### 3. Create Monitoring Check

```bash
TOKEN="abc123def456"

curl -X POST http://localhost:3000/check \
  -H "Content-Type: application/json" \
  -d '{
    "protocol": "https",
    "url": "www.google.com",
    "method": "GET",
    "successCodes": [200],
    "timeoutSeconds": 5
  }' \
  "?token=$TOKEN"

# Response includes: checkId
```

#### 4. View Check Status

```bash
curl "http://localhost:3000/check?id=checkId123&token=$TOKEN"

# Shows current state: "up" or "down"
```

#### 5. Update Check

```bash
curl -X PUT http://localhost:3000/check \
  -H "Content-Type: application/json" \
  -d '{
    "id": "checkId123",
    "successCodes": [200, 201, 204]
  }' \
  "?token=$TOKEN"
```

#### 6. Get User Info

```bash
curl "http://localhost:3000/user?token=$TOKEN"
```

#### 7. Logout (Delete Token)

```bash
curl -X DELETE "http://localhost:3000/token?id=tokenId&token=$TOKEN"
```

---

## 🏗️ Project Architecture

### Directory Structure

```
uptime-monitoring-api/
│
├── index.js                      # Entry point
├── package.json                  # Dependencies & scripts
├── routes.js                     # Route definitions
├── .env                          # Environment variables
├── .env.example                  # Example environment
│
├── handlers/                     # Request handlers
│   └── routeHandlers/
│       ├── sampleHandler.js
│       ├── userHandler.js
│       ├── tokenHandler.js
│       ├── checkHandler.js
│       └── notFoundHandler.js
│
├── helpers/                      # Utility functions
│   ├── environments.js           # Config (staging/prod)
│   ├── handleRegRes.js           # HTTP request/response
│   ├── notification.js           # Twilio SMS service
│   ├── utilities.js              # Helper functions
│   └── data.js                   # Data operations
│
├── lib/                          # Core libraries
│   ├── server.js                 # HTTP server
│   ├── worker.js                 # Background worker
│   └── data.js                   # File persistence
│
├── .data/                        # Data storage
│   ├── users/                    # User JSON files
│   ├── tokens/                   # Token JSON files
│   └── checks/                   # Check JSON files
│
└── readme.md                     # This file
```

### Request Flow

```
HTTP Request
    ↓
routes.js (Route mapping)
    ↓
Handler (userHandler, tokenHandler, etc.)
    ↓
helpers/ (Validation, utilities)
    ↓
lib/data.js (Read/write JSON files)
    ↓
Response to client
```

### Worker Flow

```
Every 60 seconds:
  1. Read all checks from .data/checks/
  2. For each check:
     - Make HTTP/HTTPS request
     - Get status code
     - Compare to successCodes
     - Update check state (up/down)
     - If state changed:
       - Send SMS via Twilio
       - Update file
```

---

## 📊 Database Schema

### User File (.data/users/{phone}.json)

```json
{
    "firstName": "John",
    "lastName": "Doe",
    "phone": "01234567890",
    "hashedPassword": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "tosAgreement": true
}
```

### Token File (.data/tokens/{tokenId}.json)

```json
{
    "phone": "01234567890",
    "id": "abc123def456xyz789",
    "expires": 1682380800000
}
```

### Check File (.data/checks/{checkId}.json)

```json
{
    "checkId": "unique_id_12345",
    "phone": "01234567890",
    "protocol": "https",
    "url": "www.example.com",
    "method": "GET",
    "successCodes": [200, 201],
    "timeoutSeconds": 5,
    "state": "up",
    "lastChecked": 1682380500000,
    "userCreatedCheck": true
}
```

---

## 🛠️ Development

### Code Quality

#### Run ESLint

```bash
npx eslint .
```

#### Format with Prettier

```bash
npx prettier --write .
```

#### Check Code

```bash
npx eslint . --fix
npx prettier --write .
```

### Project Scripts

```json
{
    "start": "npx cross-env NODE_ENV=staging nodemon index",
    "production": "npx cross-env NODE_ENV=production nodemon index"
}
```

### Debugging

Enable verbose logging by setting in `.env`:

```env
QUIET_MODE=false
```

Watch the console output:

- Server initialization
- Worker iterations
- Request handling
- Error messages

---

## 🔧 Troubleshooting

### Issue: "TWILIO_PHONE_NUMBER is undefined"

**Solution:**

```bash
# Check .env file exists
ls -la .env

# Verify it contains:
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
```

---

### Issue: SMS Not Sending (400/21612 Error)

**Error:** "Message cannot be sent with the current combination of 'To' and 'From'"

**Solutions:**

1. **Verify credentials** - Check Twilio Console
2. **Trial account** - Verify recipient numbers in Twilio:
    - Console → Phone Numbers → Verified Caller IDs
    - Add and verify the recipient number
3. **Phone format** - Ensure `+88XXXXXXXXXXX` format (11 digits)
4. **Balance** - Check account has credits/paid plan

---

### Issue: Port 3000/5000 Already in Use

**Windows:**

```powershell
# Find process
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F
```

**Mac/Linux:**

```bash
lsof -i :3000
kill -9 <PID>
```

---

### Issue: .data Directory Missing Files

**Solution:**
Ensure structure exists:

```
.data/
├── users/
├── tokens/
└── checks/
```

Files are created automatically on first use. If errors occur:

```bash
mkdir -p .data/users .data/tokens .data/checks
```

---

### Issue: Token Expires or Returns 401

**Solution:**
Create a new token:

```bash
curl -X POST http://localhost:3000/token \
  -H "Content-Type: application/json" \
  -d '{"phone":"01234567890","password":"yourPassword"}'
```

---

### Issue: "Method not allowed" (405 Error)

**Check:**

- Are you using the correct HTTP method? (GET, POST, PUT, DELETE)
- Is the endpoint correct? (typo in route)

---

## 📝 Notes & Considerations

- **No External Database** - Uses file-based JSON storage (suitable for learning/small projects)
- **Check Frequency** - Background worker runs every 60 seconds (configurable in `/lib/worker.js`)
- **Learning Project** - Demonstrates raw Node.js patterns without frameworks
- **Production Enhancements** - Consider adding:
    - Database (MongoDB, PostgreSQL) instead of file-based storage
    - Caching layer (Redis) for performance
    - Proper secrets management (AWS Secrets Manager, HashiCorp Vault)
    - Rate limiting for API endpoints
    - Comprehensive monitoring & logging
    - HTTPS/TLS for secure communication
    - Database backup strategy
- **Security** - Passwords are hashed with SHA256; implement HTTPS for production
- **Token Expiration** - Tokens expire after 1 hour and need renewal

---

## 🚀 Deployment

### Prerequisites

- Node.js v14+ on server
- PM2 for process management (recommended)
- Environment variables configured

### Quick Deploy

```bash
# On server
git clone https://github.com/newbie-saimur/uptime-monitoring-api-project-using-raw-node.git
cd uptime-monitoring-api-project-using-raw-node
npm install
npm run production
```

### With PM2 (Recommended)

```bash
npm install -g pm2

pm2 start index.js --name "uptime-monitor"
pm2 startup
pm2 save
```

---

## 📞 Support & Contributing

### Getting Help

1. Check [Troubleshooting](#troubleshooting) section
2. Review error logs in console
3. Verify `.env` configuration
4. Check Twilio account status
5. Open an [Issue on GitHub](https://github.com/newbie-saimur/uptime-monitoring-api-project-using-raw-node/issues)

### Contributing

Contributions are welcome! Please feel free to:

- Fork the repository
- Create a feature branch (`git checkout -b feature/AmazingFeature`)
- Commit your changes (`git commit -m 'Add some AmazingFeature'`)
- Push to the branch (`git push origin feature/AmazingFeature`)
- Open a Pull Request

---

## 📄 License

MIT License - Free for learning and commercial use.

See [LICENSE](LICENSE) for details.

---

## 👨‍💻 About

**Built with ❤️ using Raw Node.js**

A comprehensive learning project demonstrating:

- HTTP/HTTPS request handling
- File-based data persistence
- Background workers
- Token authentication
- SMS integration
- REST API design

Perfect for understanding core Node.js concepts without framework abstractions.

---

**Author:** [newbie-saimur](https://github.com/newbie-saimur)  
**Repository:** [uptime-monitoring-api-project-using-raw-node](https://github.com/newbie-saimur/uptime-monitoring-api-project-using-raw-node)  
**Last Updated:** April 2026  
**Version:** 1.0.0

<!-- INSTALL & UPDATE YARN -->

## Install and Update yarn

Please follow the below instructions to install or update yarn in your machine.

### On Windows

1. Install yarn
    ```sh
    npm install -g yarn
    ```
2. Update yarn
    ```sh
    yarn set version latest
    ```

### On Mac

1. Install yarn
    ```sh
    brew install yarn
    ```
2. Update yarn
    ```sh
    brew update
    brew upgrade yarn
    ```

<!-- EDITOR SETUP -->

## VS Code Editor Setup

In order to follow along the tutorial series, I recommend you to use Visual Studio Code Editor and install & apply the below extensions and settings.

### Extensions

Install the below extensions:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Path Autocomplete](https://marketplace.visualstudio.com/items?itemName=ionutvmi.path-autocomplete)

### Settings

Go to your Visual Stuido Code `settings.json` file and add the below settings there:

```json
// config related to code formatting
"editor.defaultFormatter": "esbenp.prettier-vscode",
"editor.formatOnSave": true,
"[javascript]": {
  "editor.formatOnSave": false,
  "editor.defaultFormatter": null
},
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": true,
  "source.organizeImports": true
},
"eslint.alwaysShowStatus": true
```

### Set Line Breaks

Make sure in your VS Code Editor, "LF" is selected as line feed instead of CRLF (Carriage return and line feed). To do that, just click LF/CRLF in bottom right corner of editor, click it and change it to "LF". If you dont do that, you will get errors in my setup.

<img src="images/line-feed.jpg" alt="Line Feed" width="700">

<!-- LINTING SETUP -->

## Linting Setup

In order to lint and format your code automatically according to popular airbnb style guide, I recommend you to follow the instructions as described in video. References are as below.

### Install Dev Dependencies

```sh
yarn add -D eslint prettier
npx install-peerdeps --dev eslint-config-airbnb-base
yarn add -D eslint-config-prettier eslint-plugin-prettier
```

### Setup Linting Configuration file

Create a `.eslintrc.json` file in the project root and enter the below contents:

```json
{
    "extends": ["prettier", "airbnb-base"],
    "parserOptions": {
        "ecmaVersion": 12
    },
    "env": {
        "commonjs": true,
        "node": true
    },
    "rules": {
        "no-console": 0,
        "indent": 0,
        "linebreak-style": 0,
        "prettier/prettier": [
            "error",
            {
                "trailingComma": "es5",
                "singleQuote": true,
                "printWidth": 100,
                "tabWidth": 4,
                "semi": true
            }
        ]
    },
    "plugins": ["prettier"]
}
```
