const {db} = require("../../firebase");
const {timeLeft, sendSlackMessage} = require("./../services/helpers");
const {
    setStarted,
    setJoined,
    setSingles,
    setMaxJoined,
} = require("../services/shared");
/**
 * @param {boolean} showMessage
 * Stops game
 */
const stopGame = (showMessage = false) => {
    db.ref("joined").off();
    db.ref("current_game").remove().then(() => {
        db.ref("joined").remove().then(() => {
            setStarted(false);
            setJoined([]);
            setSingles([]);
            timeLeft(null);
            setMaxJoined(4);
            if (showMessage) {
                sendSlackMessage("Stopped");
            }
        });
    });
};

module.exports = {
    stopGame,
};
