const {WebClient} = require("@slack/web-api");
const {SLACK_BOT_TOKEN, SLACK_CHANNEL_ID} = require("../../config");

const slack = new WebClient(SLACK_BOT_TOKEN);

const sendSlackMessageViaAPI = async (message) => {
    await slack.chat.postMessage({
        text: message,
        channel: SLACK_CHANNEL_ID,
    });
};

const getEmojis = async () => {
    return await slack.emoji.list();
};

module.exports = {
    sendSlackMessageViaAPI,
    getEmojis,
};
