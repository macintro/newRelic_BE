// accessControl.js

// const logger = require('../utilities/logger')(module);
const cfg = require('../utilities/config');

let allowedOrigins = [];

if ((['DEV','LOCALDEV']).includes(cfg.env)) {

  allowedOrigins.push('http://localhost:3000');
 
}

const headers = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Accept, Authorization, content-type, x-api-key");
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE");
  // res.header('Connection', 'close');
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
};

module.exports = headers;
