'use strict';

const {
  DynamoDBDocumentClient,
  SQS,
  XRay,
} = require('@alpha-lambda/aws-drivers');

const Notifier = require('./nofitier');

const initializeDrivers = async (s) => {
  return {
    notifier: new Notifier(s.c.notifier),
    dynamodb: new DynamoDBDocumentClient({ level: 'debug' }),
    dynamodbConverter: AWS.DynamoDB.Converter,
    sqs: new SQS({ level: 'debug' }),
    xray: new XRay({ level: 'debug', ...s.c.xRay }),
  }
};

module.exports = {
  initializeDrivers,
}
