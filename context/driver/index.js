'use strict';

const AWS = require('aws-sdk');
const {
  DynamoDBDocumentClient,
  SQS,
  XRay,
} = require('@alpha-lambda/aws-drivers');

const Notifier = require('./nofitier');

const initialize = async (log, error, state) => {
  const level = 'debug';
  try {
    return {
      notifier: new Notifier(state.c.notifier),
      dynamodb: new DynamoDBDocumentClient(level),
      dynamodbConverter: AWS.DynamoDB.Converter,
      sqs: new SQS(level),
      xray: new XRay({ level, ...state.c.xRay }),
    };
  } catch (e) {
    error.internal.FailedToIntialize('drivers', e);
  }
};

module.exports = {
  initialize,
};
