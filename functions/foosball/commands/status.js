const {
    prepareUserIdForMessage,
    sendSlackMessage,
    timeLeft,
} = require("../services/helpers");
const {getStarted, getMaxJoined, getJoined} = require("../services/shared");

const handleStatus = async () => {
    const joined = await getJoined();
    const playerString = joined.map(
        (player) => prepareUserIdForMessage(player.userId),
    ).join(", ");

    sendSlackMessage(
        "STATUS \n" +
        "Game started: " + getStarted() + "\n" +
        "participants: " +
        (playerString === "" ? "none" : playerString) +
        "\n" +
        "Spots left: " + (getMaxJoined() - joined.length) + "\n" +
        "Timer: " + timeLeft(),
    );
};

module.exports = {
    handleStatus,
};
