'use strict';

const assert = require('assert');

module.exports = (context, postId) => {
  assert(postId, 'missing postId');

  const { config: { delimiter } } = c.config;
  return postId.split(delimiter).slice(1, -1).join(delimiter);
};
