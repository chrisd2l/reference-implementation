'use strict';

require initializeConfig = require('./config.js');

const initialize = async (log, error) => {
  const config = initializeConfig(log, error);
  try {
    return {
      config,
      setRequestId,
    };
  } catch (e) {
    throw new error.internal.FailedToIntialize('state', e);
  }
};


module.exports = initialize;
