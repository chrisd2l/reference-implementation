'use strict';

const sendNotification = require('./sendNotification');
const updateVoteCount = require('./updateVoteCount');

const initialize = async(log, error, state, driver, model) => {
  try {
    const definitions = [
      sendNotification,
      updateVoteCount,
    ];

    return {
      tasks: driver.tasks(definitions),
    };
  }
  catch (e) {
    throw new error.internal.InitializeError('tasks', e);
  }
};

module.exports = initialize;
