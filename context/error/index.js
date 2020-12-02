'use strict';
// todo finish common errors and extract to repo

class InternalError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.statusCode = 500;
    this.details = details;
  }
}

class ExternalError extends Error {
  constructor(message, code, details) {
    super(message, code, details);
    this.statusCode = code || 500;
  }
}

class LambdaError extends InternalError {
  constructor(message, code, details) {
    super(message || 'Lambda error', code, details);
  }
}

class InitializeError extends InternalError {
  constructor(directory, error) {
    super(`Failed during initialization of ${directory}`, error);
  }
}

const initialize = () => {
  try {
    return {
      internal: {
        InitializeError,
        InternalError,
        LambdaError,
      },
      external:  {
        ExternalError,
      },
    };
  } catch (e) {
    throw new Error('Failed to initialize error', e);
  }
};

module.exports = initialize;
