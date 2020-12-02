'use strict';

const initializeLog = (c) => {
  return (event, c, next) => {
    const { clientc = {} } = c;
    const { requestId = c.awsRequestId } = clientc;

    c.state.setRequestId(requestId);
    return next();
  };
}

module.exports = initializeLog;
