const {sendSlackMessage} = require("../services/helpers");
const {handleStart, start} = require("./start");
const {
    getJoined,
    getMaxJoined,
    getStarted,
} = require("../services/shared");
const {addPlayerToGame} = require("./addPlayer");


/**
 * Handle join command
 * @param {string} user
 * @param {boolean} isSingle
 * @return {Promise<void>}
 */
const handleJoin = async (user, isSingle) => {
    console.log(user + " trying to join");
    const joined = await getJoined();
    if (getStarted()) {
        const canJoin = isSingle ?
            (joined.length <= getMaxJoined() - 2) :
            (joined.length < getMaxJoined());

        if (canJoin) {
            if (joined.filter((u) => u.userId === user).length === 0) {
                await addPlayerToGame(user, isSingle).then(
                    (shouldStart) => {
                        console.log("shouldStart", shouldStart);
                        if (shouldStart) {
                            start();
                        }
                    },
                );
            } else {
                sendSlackMessage("Already joined");
            }
        } else {
            sendSlackMessage("No more room");
        }
    } else {
        console.log("no games, starting new...");
        await handleStart(user, isSingle);
    }
};


module.exports = {
    handleJoin,
};
