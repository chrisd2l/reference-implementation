'use strict';
// todo finish errors

class InternalError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.statusCode =  500;
    this.details = details;
  }
}

class ExternalError extends Error {
  constructor(message, code, details) {
    super(message, code, details)
    this.statusCode = code || 500;
  }
}

class LambdaError extends InternalError {
  constructor(message, code, details) {
    super(message || 'lambda error', code, details);
  }
}

class InitializeError extends InternalError {
  constructor(directory, error) {
    super(`failed during initialization of ${directory}`, e);
  }
}

const initializeError = () => {
  return {
    internal: {
      InitializeError,
      InternalError,
      LambdaError,
    },
    external:  {
      ExternalError,
    }
  };
}

module.exports = {
  intializeError,
};
