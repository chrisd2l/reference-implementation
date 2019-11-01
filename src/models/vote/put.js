'use strict';

const assert = require('assert');

const {
  expand,
  compact,
} = require('./compression');
const { TYPE } = require('./const');

module.exports = async (context, { data, postId, userId } = {}) => {
  assert(data, 'missing postId');
  assert(postId, 'missing postId');
  assert(userId, 'missing userId');

  const {
    config: { tableName },
    drivers: { dynamodb },
  } = context;

  const now = new Date().toISOString();

  const params = {
    TableName: tableName,
    Key: compact({ postId, userId }),
    UpdateExpression: `
      SET
      #createdAt = if_not_exists(#createdAt, :now),
      #data = :data,
      #type = :type,
      #updatedAt = :now

      ADD
      #version :one
    `,
    ExpressionAttributeNames: {
      '#createdAt': compact('createdAt'),
      '#data': compact('data'),
      '#type': compact('type'),
      '#updatedAt': compact('updatedAt'),
      '#version': compact('version'),
    },
    ExpressionAttributeValues: {
      ':data': data,
      ':now': now,
      ':one': 1,
      ':type': TYPE,
    },
    ReturnValues: 'ALL_NEW',
  };

  const result = await dynamodb.update(context, params);

  return expand(result.Attributes);
};
