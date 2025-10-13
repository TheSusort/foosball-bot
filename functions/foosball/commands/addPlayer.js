const {getUser} = require("../services/users");
const {
    getMaxJoined,
    setMaxJoined, pushToJoined, pushToSingles,
} = require("../services/shared");
const {sendSlackMessage} = require("../services/helpers");
/**
 * Adds player to game
 * @param {string} playerName
 * @param {boolean} isSingle
 * @return {Promise<*[]>}
 */
const addPlayerToGame = async (playerName, isSingle) => {
    // add to joined
    const user = await getUser(playerName);
    let maxJoined = getMaxJoined();
    user.isSingle = isSingle;

    return await pushToJoined(user).then((joined) => {
        if (isSingle) {
            pushToSingles(playerName);
            setMaxJoined(maxJoined - 1);
            maxJoined = getMaxJoined();
        }
        // if has enough players
        if (joined.length === maxJoined) {
            console.log("enough players, should start game");
            return true;
        } else {
            sendSlackMessage(
                "<@" + playerName + ">" +
                " joined" + (isSingle ? " as single" : "") + ", " +
                (maxJoined - joined.length) +
                " space(s) left",
            );
        }
        return false;
    });
};

module.exports = {
    addPlayerToGame,
};
