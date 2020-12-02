'use strict';

module.exports = {
  type: 'sendNotification',
  schedule(context, tasks) {
    c.log.debug({ tasks }, 'scheduling sendNotification tasks');

    const { sendNotification } = c.config.tasks;
    const { sqs } = c.drivers;

    const messages = tasks.map(task => ({ body: task.toJSON() }));

    return sqs.send(context, sendNotification.queueUrl, messages);
  },
  execute(context, tasks) {
    const { notifier } = c.drivers;
    const { post } = c.models;
    const { sendNotification } = c.config.tasks;

    const parentPosts = Promise.map(tasks, task => {
      const { postId } = task.detail;
      const parentId = post.getParentId(context, postId);
      return post.get(context, parentId);
    });

    const usersToNotify = parentPosts.reduce((acc, parent) => {
      const { data, userId } = parent;
      const shortTitle = `"${data.slice(0, sendNotification.titleLength)}"`;

      if (acc.has(userId)) {
        acc.set(userId, acc.get(userId).push(shortTitle));
      } else {
        acc.set(userId, [shortTitle]);
      }

      return acc;
    }, new Map());

    const notifications = Array.from(usersToNotify.entries()).map(([userId, titles]) => {
      return {
        userId,
        message: ['New activity in your post(s):'].concat(titles).join('\n\t'),
      };
    });

    return notifier.send(context, notifications);
  },
};
