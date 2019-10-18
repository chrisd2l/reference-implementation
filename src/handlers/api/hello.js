'use strict';

const { api } = require('../handler');

module.exports.handler = api()
  .use((event, context) => {
    return { event, context };
  });
