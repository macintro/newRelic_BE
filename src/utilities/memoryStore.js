// This is pretty much a copy/pasta from https://github.com/nfriedly/express-rate-limit/blob/2a48493756ff2f04c79be1be0330f5781e2855dd/lib/express-rate-limit.js
// just overwriting the function `this.incr` to calculate the reset time from the last failed attempt
function calculateNextResetTime(windowMs) {
  const d = new Date();
  d.setMilliseconds(d.getMilliseconds() + windowMs);
  return d;
}

function MemoryStore(windowMs,max) {
  let hits = {};
  let resetTime = calculateNextResetTime(windowMs);

  this.incr = function (key, cb) {
    if (hits[key]) {
      hits[key]++;
    } else {
      hits[key] = 1;
    }
    if (hits[key] == max){
      //calculate the reset time from the last failed attempt
      resetTime = calculateNextResetTime(windowMs);
    }
    cb(null, hits[key], resetTime);
  };

  this.decrement = function (key) {
    if (hits[key]) {
      hits[key]--;
    }
  };

  // export an API to allow hits all IPs to be reset
  this.resetAll = function () {
    hits = {};
    resetTime = calculateNextResetTime(windowMs);
  };

  // export an API to allow hits from one IP to be reset
  this.resetKey = function (key) {
    delete hits[key];
  };

  // simply reset ALL hits every windowMs
  const interval = setInterval(this.resetAll, windowMs);
  if (interval.unref) {
    interval.unref();
  }
}

module.exports = MemoryStore;
