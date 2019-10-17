'use strict';

const { api } = require('../handler');

module.exports.handler = api()
  .use(() => {
    return 'Hello, world!';
  });
