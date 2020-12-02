'use strict';

module.exports = {
  type: 'updateVoteCount',
  schedule(c, tasks) {
    c.log.debug({ tasks }, 'scheduling updateVoteCount tasks');

    const { updateVoteCount } = c.config.tasks;
    const { sqs } = c.drivers;

    const messages = tasks.map(task => ({ body: task.toJSON() }));

    return sqs.send(c, updateVoteCount.queueUrl, messages);
  },
  execute(c, tasks) {
    const { post } = c.models;

    const votes = tasks.reduce((acc, task) => {
      const { postId, value } = task.detail;

      if (acc.has(postId)) {
        acc.set(postId, acc.get(postId) + value);
      } else {
        acc.set(postId, value);
      }

      return acc;
    }, new Map());

    return Promise.all(Array.from(votes.entries()).map(([postId, count]) => {
      return post.updateVoteCount(c, { postId, count });
    }));
  },
};
