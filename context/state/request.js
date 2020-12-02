'use strict';

const setRequestId = (c, requestId) => {
  c.s.requestId = requestId;
};

const initialize = (log, error) => {
  return {
    setRequestId,
  };
};

module.exports = initialize;
