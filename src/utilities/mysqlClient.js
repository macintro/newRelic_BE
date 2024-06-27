// const logger = require('../utilities/logger')(module);
const Promises = require("bluebird");
const mysql = require('mysql');

Promises.promisifyAll(require("mysql/lib/Connection").prototype);
Promises.promisifyAll(require("mysql/lib/Pool").prototype);

const cfg = require('./config');

const connection_conf = 
{ connectionLimit : 20
, host            : cfg.ctxEnvValue('MYSQL_DB_SERVER')
, user            : cfg.ctxEnvValue('MYSQL_DB_USER')
, password        : cfg.ctxEnvValue('MYSQL_DB_PASSWORD')
, database        : cfg.ctxEnvValue('MYSQL_DB_DBNAME')
, ssl             : cfg.ctxEnvValue('MYSQL_DB_SSL')
}
const connectionPool = mysql.createPool(connection_conf);

const logged_con_info = JSON.parse(JSON.stringify(connection_conf));
logged_con_info.password = '*'.repeat(connection_conf.password.length);
console.info('MySQL connection info '+JSON.stringify(logged_con_info));

const queryPromise = async (template, parameter) => {
    return connectionPool.queryAsync(template, parameter);
};

const fetchRow = async (proc_name, args, masked_results) => {
  try {
    const placeholders = (args) ? ',?'.repeat(args.length).substr(1) : '';
    const template = 'call ' + proc_name + '(' + placeholders + ');';
    // console.info(`fetchRow() calling proc: ${proc_name} ( ${JSON.stringify(args)} )`);
    const result = await queryPromise(template, args);
    if (result && result.length && result.length > 0 && result[0].length && result[0].length > 0) {
      // console.info(`fetchRow() success, result: %o`, {...result[0][0], ...masked_results});
      return result[0][0];
    }
  }
  catch (err) {
    console.error('fetchRow() failed: ' + err.message);
  }
  return null;
};

const fetchArray = async (proc_name, args) => {
  try {
    const placeholders = (args) ? ',?'.repeat(args.length).substr(1) : '';
    const template = 'call ' + proc_name + '(' + placeholders + ');';
    // logger.debug(`fetchArray() calling proc: ${proc_name} ( ${JSON.stringify(args)} )`);
    const result = await queryPromise(template, args);
    if (result && result.length) {
      if (result[0].length) {
        // logger.debug(`fetchArray() success, returned ${result[0].length} rows`);
        return result[0];
      } else {
        console.info(`fetchArray() success, returned 0 rows`);
      }
    }
  }
  catch (err) {
    console.error('fetchArray() failed: ' + err.message);
  }
  return null;
};

const fetchSPRow = async (stored_proc, named_args, masked_results) => {
  try {
    const proc_name = stored_proc[0];
    const placeholders = ',?'.repeat(stored_proc.length-1);
    // create an args array per the stored_proc declaration
    let args = [];
    let logged = [];
    for (var i=1; i<stored_proc.length; i++) {
      const no_log = (stored_proc[i].startsWith("-"));
      const p_name = (no_log) ? stored_proc[i].substr(1) : stored_proc[i];
      // set args to provided values in the named_args object, or null if not provided
      args.push(   (p_name in named_args) ?                        named_args[p_name]  : null );
      logged.push( (p_name in named_args) ? ((no_log)?'**masked**':named_args[p_name]) : null );
    }
    const template = 'call ' + proc_name + '(' + placeholders.substr(1) + ');';
    // logger.debug(`fetchSPRow() calling proc: ${proc_name} ( ${JSON.stringify(logged)} )`);
    const result = await queryPromise(template, args);

    if (result && result.length && result.length > 0 && result[0].length && result[0].length > 0) {
      // logger.debug(`fetchSPRow() success, result: %o`, {...result[0][0], ...masked_results});
      return result[0][0];
    }
  }
  catch (err) {
    console.error('fetchSPRow() failed: ' + err.message);
  }
  return null;
};

module.exports = {fetchRow, fetchArray, fetchSPRow};
