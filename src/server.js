// server.js

const logger = require('./utilities/logger')(module);
const app = require('./app');
const port = process.env.PORT || 3014;

app.listen(port, () => {
  logger.info('server listening on port: ' + port)
})


