'use strict';

const uuid = require('uuid');

const config = require('../c/state/config');

module.exports = function() {

  before(function() {
    this.c = {
      getRemainingTimeInMillis: () => 5 * 60 * 1000, // 5 minutes
      config,
      requestId: uuid.v4(),
      drivers: {},
    };
  });
};
