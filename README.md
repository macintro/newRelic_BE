# NewRelic_BE

**NewRelic_BE** is a Node.js service designed to handle API requests, interact with a database to retrieve requested information, and ensure secure and controlled access through middleware.

## Table of Contents
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Middleware](#middleware)
- [Utilities](#utilities)
- [Running the Server](#running-the-server)
- [Contributing](#contributing)
- [License](#license)


## Installation
To get started, clone the repository and install the necessary dependencies:
```bash
git clone https://github.com/yourusername/NewRelic_BE.git
cd NewRelic_BE
npm install
```

## Configuration
The service uses different configurations based on the environment (development, production, etc.). The configurations are stored in config.js located in the utilities folder.

Note: In a production environment, sensitive information such as API keys should be stored in a secure vault or a similar secure storage solution.

## Usage
To start the service, run:

```bash
npm start
```
By default, the service will run on port 3014.

## API Endpoints
The available endpoints are:

**GET /customers/getCustomerInfo**
This endpoint retrieves customer information based on the provided search term.

**GET /customers/getCompanyByName**
This endpoint retrieves company information based on the provided search term.

**Middleware**
The service uses several middleware functions to enhance security and functionality:

**Access Control**
The accessControl middleware is used to prevent CORS issues and allows requests from specific origins only.

**Key Check**
The key_check middleware checks the API key when an endpoint is called to ensure that the request is authorized.

```bash
const accessControl = require('./middleware/accessControl');
const keyCheck = require('./middleware/key_check');

app.use(accessControl);
app.use(keyCheck);
```

## Utilities
**Config**
The config.js file in the utilities folder provides configurations based on the environment. It ensures that the service runs with the correct settings for development, testing, or production.

**Logger**
A logger is included to write out logs, making it easier to debug and monitor the service.

## Running the Server
The server.js file specifies the port (3014) and starts the server:
```bash
const express = require('express');
const app = express();
const port = 3014;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```
## Contributing
Contributions are welcome! Please fork the repository, create a new branch for your feature or bugfix, and submit a pull request. Keep in mind this is just a sample of my work but if you're so inclined go for it. 

## License
This project is licensed under the MIT License.
