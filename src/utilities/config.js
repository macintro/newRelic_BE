// utilities/config.js
// const logger = require('./logger')(module);
require('dotenv').config();


const g_env = process.env.NRDemo_ENV || 'LOCALDEV';

console.log("ENV: "+process.env.NRDemo_ENV);
console.log('Environment:' + g_env);

//ideally we should put these elsewhere like a vault
const environment_cfg =
{ 'LOCALDEV'  :
    { ACCESS_API_KEYS              : `["b6493bfb-1957-435f-93ee-7921a25858e8","a46cce3c-3439-41de-8ad0-100e0229dad9"]`//we have two so that they can be rotated
    , MYSQL_DB_DBNAME              : 'NRDemo'
    , MYSQL_DB_PASSWORD            : 'NRDemoService!3'
    , MYSQL_DB_SERVER              : '127.0.0.1'
    , MYSQL_DB_SSL                 : false//TODO: i need to upgrade to mysql 8 and enable ssl on the server
    , MYSQL_DB_USER                : 'NRService'
    }
};

module.exports.env = g_env;

module.exports.ctxEnvValue = (key) => {
    var uc_key = key.toUpperCase();
    if (!g_env) {
        console.error('Environment var NRDemo_ENV not set. Context can not be established!');
        return undefined;
    }
    if (!(['LOCALDEV', 'PROD'].includes(g_env))) {
        console.error('Environment var NRDemo_ENV is invalid! Valid values: LOCALDEV, PROD');
        return undefined;
    }
    if (!(uc_key in environment_cfg[g_env])) {
        console.error('Error: key <' + uc_key + '> not defined in environment_cfg')
        return;
    }
    return environment_cfg[g_env][uc_key];
};

