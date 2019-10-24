'use strict';

const { sqs } = require('../handler');

module.exports.handler = sqs()
  .use(() => {
    console.log('execute tasks');
  });
