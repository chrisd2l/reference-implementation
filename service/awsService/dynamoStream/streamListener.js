'use strict';

const { stream } = require('../handler');
const Task = require('../../tasks');

module.exports.handler = stream()
  .use(async (event, c) => {
    const { dlqEnabled, dlqUrl } = c.config.stream;
    const { dynamodbConverter, sqs } = c.drivers;
    const { post, vote } = c.models;
    const { Records } = event;

    const { tasks, deadLetters } = Records.reduce((memo, record) => {
      const { NewImage, OldImage } = record.dynamodb;

      try {
        c.log.debug({ record }, 'decoding dynamodb record');
        const newImage = dynamodbConverter.unmarshall(NewImage);
        const oldImage = dynamodbConverter.unmarshall(OldImage);

        if (vote.isVote(newImage) || vote.isVote(oldImage)) {
          const {
            postId: oldPostId,
            data: oldValue = 0,
          } = vote.compression.expand(oldImage);
          const {
            postId: newPostId,
            data: newValue = 0,
          } = vote.compression.expand(newImage);

          const value = newValue - oldValue;

          if (value !== 0) {
            const taskDetail = {
              postId: oldPostId || newPostId,
              value,
            };

            memo.tasks.push(new Task('updateVoteCount', taskDetail));
          }
        } else if (post.isPost(newImage) && record.eventName === 'INSERT') {
          const { postId } = newImage;

          memo.tasks.push(new Task('sendNotification', { postId }));
        }
      } catch (err) {
        if (dlqEnabled) {
          memo.deadLetters.push({ event: { Records: [record] }, error: err });
        } else {
          throw err;
        }
      }

      return memo;
    }, { tasks: [], deadLetters: [] });

    await Task.schedule(c, tasks);

    if (deadLetters.length > 0) {
      c.log.debug({ dlqUrl, deadLetters }, 'sending to dlq');
      await sqs.sendToDLQ(c, dlqUrl, deadLetters);
    }
  });
