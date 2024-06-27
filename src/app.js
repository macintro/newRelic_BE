// app.js
const express = require("express");
const https = require("https");

const morgan = require('morgan');
const ecsFormat = require('@elastic/ecs-morgan-format');

const fs = require('fs');
const path = require('path');
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const app = express();


// https.createServer(options, app).listen(3016);


// Middleware
const accessControl = require('./middleware/accessControl');
const router = require('./routes/router');

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1);


// STDOUT request logger for LOCALDEV and kubectl log inspection
app.use(morgan(':date[iso] \x1b[35mrequest\x1b[0m [morgan] :method :url :status :response-time ms - :res[content-length]'));
// Access log for Observability into a file for elastic ingestion. Using 'short' includes the 'response-time'
app.use(morgan(ecsFormat( {format: 'short'} ), {stream: fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' })})); 

app.use(express.json({ extended: false }));
app.use(accessControl);
app.use('/', router);

module.exports = app