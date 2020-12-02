'use strict';

const initializeMiddleware = () => {
  log({ level = 'info' } = {}) {
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
  }
};

module.exports = {

};
