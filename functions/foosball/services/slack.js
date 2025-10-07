const {WebClient} = require("@slack/web-api");
const {SLACK_BOT_TOKEN, SLACK_CHANNEL_ID} = require("../../config");

const slack = new WebClient(SLACK_BOT_TOKEN);

const sendSlackMessageViaAPI = async (message) => {
    if (typeof message === "string") {
        return await slack.chat.postMessage({
            text: message,
            channel: SLACK_CHANNEL_ID,
        });
    } else {
        return await slack.chat.postMessage({
            text: "fallback text",
            blocks: message,
            channel: SLACK_CHANNEL_ID,
        });
    }
};

const updateSlackMessage = async (timestamp, blocks) => {
    try {
        return await slack.chat.update({
            channel: SLACK_CHANNEL_ID,
            ts: timestamp,
            text: "fallback text",
            blocks: blocks,
        });
    } catch (error) {
        console.error("Failed to update Slack message:", error);
        return null;
    }
};

const getEmojis = async () => {
    return await slack.emoji.list();
};

const getUserProfile = async (userId) => {
    try {
        const result = await slack.users.info({user: userId});
        return result.user.profile;
    } catch (error) {
        console.error("Failed to fetch user profile for", userId, ":", error);
        return null;
    }
};

const getBotUserId = async () => {
    try {
        const result = await slack.auth.test();
        return result.user_id;
    } catch (error) {
        console.error("Failed to get bot user ID:", error);
        return null;
    }
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
    updateSlackMessage,
    getEmojis,
    getUserProfile,
    getBotUserId,
    getChannelMessageList,
};
