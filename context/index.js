'use strict';

const initializeDriver = require('./driver');
const initializeError = require('./error');
const initializeLog = require('./log');
const initializeModel = require('./model');
const initializeState = require('./state');
const initializeTasks = require('./tasks');

const initialize = async () => {
  let error;
  try {
    error = initializeError();
  } catch (e) {
    throw new Error('Failed to initialize errors', e);
  }

  const log = await initializeLog(error);
  const state = await initializeState(log, error);
  const driver = await initializeDriver(log, error, state);
  const model = await initializeModel(log, error, state, driver);
  const tasks = await initializeTasks(log, error, state, driver, model);

  return {
    d: driver,
    e: error,
    l: log,
    m: model,
    s: state,
    t: tasks,
  };
}

module.exports = initialize;
