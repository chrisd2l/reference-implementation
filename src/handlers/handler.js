'use strict';

const alpha = require('@alpha-lambda/handler');

const config = require('../config');

module.exports.api = () =>
  alpha()
    .with({ config });
