# NewRelic_BE

**NewRelic_BE** is a Node.js service designed to handle API requests, interact with a database to retrieve requested information, and ensure secure and controlled access through middleware.

## Table of Contents
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)


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
