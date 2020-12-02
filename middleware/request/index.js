'use strict';

module.exports = () => {
  return (event, c, next) => {
    const { clientc = {} } = c;
    const { requestId = c.awsRequestId } = clientc;

    c.state.setRequestId(requestId);

    return next();
  };
};
