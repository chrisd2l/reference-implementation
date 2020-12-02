'use strict';

const Ajv = require('ajv');

const ajv = new Ajv({
  allErrors: true,
  verbose: true,
});

module.exports = {
  compile(c, schema) {
    return ajv.compile(schema);
  },

  validate(c, validator, object, options) {
    const valid = validator(object);

    if (valid) {
      return;
    }

    throw new c.e.internal.LambdaError({
      message: ajv.errorsText(validator.errors, options),
      statusCode: 400,
    });
  },
};
