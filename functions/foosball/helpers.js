const request = require("request");
const webhookUrl = "https://hooks.slack.com/services/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";
/**
 * Shuffles an array
 * @param {array} array
 * @return {*}
 */
const shuffle = (array) => {
  let currentIndex = array.length; let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
};
/**
 * wraps userid for slack message
 * @param {string} userId
 * @return {string}
 */
const prepareUserIdForMessage = (userId) => {
  return "<@" + userId + ">";
};

/**
 * sends slack message
 * @param {string} message
 */
const sendSlackMessage = (message) => {
  console.log("should display message: " + message);
  const shouldPostToSlack = true;
  if (shouldPostToSlack) {
    request.post({
      headers: {"content-type": "application/json"},
      url: webhookUrl,
      json: {
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": message,
            },
          },
        ],
      },
    });
  }
};

/**
 * timer
 * @param {function} callback
 * @param {int} delay
 * @return {Timer}
 * @constructor
 */
function Timer(callback, delay) {
  let id; let started; let remaining = delay; let running;

  this.start = function() {
    running = true;
    started = new Date();
    id = setTimeout(callback, remaining);
  };

  this.pause = function() {
    running = false;
    clearTimeout(id);
    remaining -= new Date() - started;
  };

  this.getTimeLeft = function() {
    if (running) {
      this.pause();
      this.start();
    }
    const date = new Date(remaining);
    return (date.getMinutes() < 10 ? "0" : "") +
        date.getMinutes() + ":" +
        (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
  };

  this.getStateRunning = function() {
    return running;
  };

  this.start();
  return this;
}

exports.shuffle = shuffle;
exports.prepareUserIdForMessage = prepareUserIdForMessage;
exports.sendSlackMessage = sendSlackMessage;
exports.Timer = Timer;
