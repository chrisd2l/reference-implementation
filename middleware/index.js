'use strict';

const initializeLog = require('./log');
const initializeRequest = require('./request');
const initializeResponse = require('./response');

const initializeMiddleware = (c) => {
  const log = initializeLog(c);
  const request = initializeRequest(c);
  const response = initializeResponse(c);

  return {
    log,
    request,
    response,
  };
}

module.exports = initializeMiddleware;
