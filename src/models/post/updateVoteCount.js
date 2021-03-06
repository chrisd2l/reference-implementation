'use strict';

const assert = require('assert');

const {
  expand,
  compact,
} = require('./compression');
const getParentId = require('./getParentId');

module.exports = async (context, { postId, count } = {}) => {
  assert(postId, 'missing postId');
  assert(typeof count !== 'undefined', 'missing count');

  const {
    config: { tableName },
    drivers: { dynamodb },
  } = context;

  const parentId = getParentId(context, postId);
  const now = new Date().toISOString();

  const params = {
    TableName: tableName,
    Key: compact({ parentId, postId }),
    UpdateExpression: `
      SET
      #updatedAt = :now

      ADD
      #version :one,
      #voteCount :count
    `,
    ConditionExpression: `
        attribute_exists(#version)
    `,
    ExpressionAttributeNames: {
      '#updatedAt': compact('updatedAt'),
      '#version': compact('version'),
      '#voteCount': compact('voteCount'),
    },
    ExpressionAttributeValues: {
      ':now': now,
      ':one': 1,
      ':count': count,
    },
    ReturnValues: 'ALL_NEW',
  };

  const result = await dynamodb.update(context, params);

  return expand(result.Attributes);
};
