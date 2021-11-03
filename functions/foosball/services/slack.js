const {WebClient} = require("@slack/web-api");
const {SLACK_BOT_TOKEN, SLACK_CHANNEL_ID} = require("../../config");

const slack = new WebClient(SLACK_BOT_TOKEN);

const sendSlackMessageViaAPI = async (message) => {
    if (typeof message === "string") {
        await slack.chat.postMessage({
            text: message,
            channel: SLACK_CHANNEL_ID,
        });
    } else {
        await slack.chat.postMessage({
            text: "fallback text",
            blocks: message,
            channel: SLACK_CHANNEL_ID,
        });
    }
};

const getEmojis = async () => {
    return await slack.emoji.list();
};

const getChannelMessageList = async () => {
    let messageData = await slack.conversations.history({
        channel: SLACK_CHANNEL_ID,
        limit: 1000,
        oldest: "1634026932.012300",
    });
    const messages = messageData.messages;
    console.log("type messages", typeof messages);
    while (messageData.has_more) {
        console.log("getting new batch, messages:", messages.length);
        messageData = await slack.conversations.history({
            channel: SLACK_CHANNEL_ID,
            cursor: messageData.response_metadata.next_cursor,
            limit: 1000,
            oldest: "1634026932.012300",

        });

        console.log("next cursor", messageData.response_metadata.next_cursor);
        console.log("type new messages", typeof messageData.messages);
        Array.prototype.push.apply(messages, messageData.messages);
        console.log("new messages length", messages.length);
        console.log(messageData.has_more);
    }

    return messages;
};

module.exports = {
    sendSlackMessageViaAPI,
    getEmojis,
    getChannelMessageList,
};
