'use strict';

const alpha = require('@alpha-lambda/handler');
const AWS = require('aws-sdk');

const ajv = require('../ajv');

const initializeMiddleware = require('../middleware');
const initializec = require('../c');

const handler = () => {
  const c = initializec();
  const middleware = initializeMiddleware(c);

  return alpha()
  .with(c)
  .use(middleware.requestId())
  .use(middleware.logging({ level: c.c.logLevel }));
}

const apiHandler = ({ schema = true } = {}) => {
  const validator = ajv.compile(schema);

  return handler()
    .use(middleware.response())
    .use(async (event, c, next) => {
      ajv.validate(validator, event);
      return next();
    });
};

module.exports = {
  api: apiHandler,
  sqs: handler
  stream: handler,
}
