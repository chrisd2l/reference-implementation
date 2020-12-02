'use strict';

const initializeDriver = require('./driver');
const error = require('./error');
const model = require('./../model');
const state = require('./../state');

module.exports = async () => {

  const error = require('./error');
  const state = initializeState(error);
  const driver = initializeDriver(error, state);
  const model = initializeModel(error, state, driver);

  const context = {
    d: driver,
    e: error,
    m: model,
    s: state,
  }
}
