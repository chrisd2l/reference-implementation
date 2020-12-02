'use strict';

const _ = require('lodash');
const pino = require('pino');
const { ResponseBuilder } = require('lambda-envelope');

const config = require('../config');

module.exports = {
  logging({ level = 'info' } = {}) {
    const serializers = pino.stdSerializers;
    const redact = {
      paths: [
        'c.config',
        'c.drivers',
        'c.log',
        'c.models',
        'event.Records[*].dynamodb',
      ],
      remove: true,
    };

    const log = pino({ level, redact, serializers, base: null });

    return async (event, c, next) => {
      const {
        awsRequestId,
        functionName,
        functionVersion,
        requestId,
      } = c;

      const xRayTraceId = c.d.xray.getXRayTraceId();

      Object.assign(c, {
        log: log.child({ requestId }),
      });

      c.log.info({
        functionName,
        functionVersion,
        awsRequestId,
        xRayTraceId
      });
      c.log.trace({ event }, 'incoming event');

      try {
        return await next();
      } catch (err) {
        c.log.error({ err }, 'unhandled err');
        throw err;
      }
    };
  },

  requestId() {
    return (event, context, next) => {
      const { awsRequestId, clientContext = {} } = context;
      const { requestId = awsRequestId } = clientContext;

      Object.assign(context, { requestId });

      return next();
    };
  },

  response() {
    const builder = new ResponseBuilder({
      bucket: config.responseBucket,
    });

    return async (event, context, next) => {
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
  },
};
