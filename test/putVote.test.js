'use strict';

const lambdaTester = require('lambda-tester');
const uuid = require('uuid');

const putVote = require('../context/state/handler/api/putVote');
const setupTestHarness = require('./setup-test-harness');

describe('putVote', function() {

  setupTestHarness();

  it('puts user vote', function() {
    const { delimiter } = this.c.c;

    return lambdaTester(putVote.handler)
      .event({
        postId: `${uuid.v4()}${delimiter}${uuid.v4()}`,
        userId: uuid.v4(),
        data: 1,
      })
      .c(this.c)
      .expectResolve();
  });
});
