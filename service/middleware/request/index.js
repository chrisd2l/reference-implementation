'use strict';

module.exports = () => {
  return (event, c, next) => {
    const { clientContext = {} } = c;
    const { requestId = c.awsRequestId } = clientContext;

    c.state.setRequestId(requestId);

    return next();
  };
};
