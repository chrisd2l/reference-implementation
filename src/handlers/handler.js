'use strict';

const alpha = require('@alpha-lambda/handler');

const config = require('../config');

module.exports.api = () =>
  alpha()
    .with({ config });

module.exports.sqs = () =>
  alpha()
    .with({ config });


module.exports.stream = () =>
  alpha()
    .with({ config });
