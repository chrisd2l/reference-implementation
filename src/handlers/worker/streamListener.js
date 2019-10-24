'use strict';

const { stream } = require('../handler');

module.exports.handler = stream()
  .use(() => {
    console.log('schedule tasks');
  });
