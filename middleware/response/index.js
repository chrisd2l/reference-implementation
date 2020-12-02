//todo
const _ = require('lodash');
const pino = require('pino');

const { ResponseBuilder } = require('lambda-envelope');

module.exports = (c) => {
  const builder = new ResponseBuilder({
    bucket: config.responseBucket,
  });

  return async (event, c, next) => {
    try {
      const response = await next();
      return builder.build({
        statusCode: 200,
        body: response,
      });
    } catch (err) {
      const response = builder.build({
        statusCode: err.statusCode || 500,
        body: _.omit(err, 'stack'),
      });

      if (response.statusCode < 500) {
        return response;
      }

      c.log.error({ err }, 'failed to process request');
      throw response;
    }
  };
}
