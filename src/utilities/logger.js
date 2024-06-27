const { createLogger, format, transports, addColors } = require('winston');
const { combine, colorize, timestamp, label, printf } = format;
const ecsFormat = require('@elastic/ecs-winston-format');

const std_format = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${level} [${label}] ${message}`;
});

let getLabel = function (callingModule) {
  let fn    = callingModule.filename.replace(/\\/g,'/'); // fix paths so works in win and linux
  let parts = fn.split('/');
  let lab   = parts[parts.length - 2] + '/' + parts.pop();
  return lab;
};

addColors({
  info: 'bold blue', // fontStyle color
  warn: 'italic yellow',
  error: 'bold red',
  debug: 'green'
});

module.exports = function (callingModule) {
  return createLogger({
    transports: 
    [ new transports.Console(
      { level: (['LOCALDEV','DEV','UAT'].includes(process.env.NRDemo_ENV)) ? 'debug' : 'info'
      , silent: false
      , format: combine
        ( colorize({all: true})
        , label({label: getLabel(callingModule)})
        , format.splat()
        , timestamp()
        , std_format
        )
      })
    , new transports.File(
      { filename: `./logs/service.log`
      , level: 'debug'
      , silent: false
      , format: combine
        ( label({label: {module:getLabel(callingModule)}})
        , format.splat()
        , ecsFormat()
        )
      })
    ]
  });
};