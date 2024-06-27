// middleware/key-check.js
const cfg    = require('../utilities/config');
// const logger = require('../utilities/logger')(module);

const valid_access_keys = JSON.parse(cfg.ctxEnvValue('ACCESS_API_KEYS'));

const key_check = async function (req, res, next) {
  const apiKey = req.header("x-api-key")

  if (!apiKey) {
    const emsg = 'No API key provided in the header, authorization denied';
    console.warn(emsg);
    return res.status(401).json({message: emsg})
  }

  for (const key of valid_access_keys) {
    if (apiKey === key) {
      next();
      return;
    }
  }

  const emsg='The API key is not valid, authorization denied';
  console.warn(emsg);
  return res.status(401).json({message: emsg});
}

module.exports = key_check
