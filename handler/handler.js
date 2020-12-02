'use strict';

const alpha = require('@alpha-lambda/handler');
const AWS = require('aws-sdk');

const ajv = require('../ajv');
const middleware = require('./middleware');

const initializeContext = require('../context');

const handler = () => {
  const c = initializeContext();
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
