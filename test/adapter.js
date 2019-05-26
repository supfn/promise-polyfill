'use strict';

let assert = require('assert');
let Promise = require('../src/Promise');

module.exports = {
  deferred: function () {
    let defer = {};
    defer.promise = new Promise((resolve, reject) => {
      defer.resolve = resolve;
      defer.reject = reject;
    });
    return defer;
  },
  defineGlobalPromise: function (global) {
    global.Promise = Promise;
    global.assert = assert;
  },
  removeGlobalPromise: function (global) {
    delete global.Promise;
  },
};
