'use strict';

const initializeDriver = require('./driver');
const initializeError = require('./error');
const initializeLog = require('./../log');
const initializeModel = require('./../model');
const initializeState = require('./../state');

module.exports = () => {

  const error = initializeError();
  const log = initializeLog(error);
  const state = initializeState(log, error);
  const driver = initializeDriver(log, error, state);
  const model = initializeModel(log, error, state, driver);

  const c = {
    d: driver,
    e: error,
    l: log,
    m: model,
    s: state,
  }
  return c;
}
