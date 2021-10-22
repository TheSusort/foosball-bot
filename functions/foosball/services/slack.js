const {WebClient} = require("@slack/web-api");
const {SLACK_BOT_TOKEN, SLACK_CHANNEL_ID} = require("../../config");

console.log(SLACK_BOT_TOKEN, SLACK_CHANNEL_ID);
const slack = new WebClient(SLACK_BOT_TOKEN);

const sendSlackMessageViaAPI = async (message) => {
    await slack.chat.postMessage({
        text: message,
        channel: SLACK_CHANNEL_ID,
    });
};

module.exports = {
    sendSlackMessageViaAPI,
};
