'use strict';

const post = require('./post');
const vote = require('./vote');

const initializeModel = async (c) => {
  try {
    return {
      post,
      vote,
    };
  } catch (e) {
    throw new c.e.internal.FailedToIntialize('model', e);
  }
};

module.exports = initializeModel;
