const {
    sendSlackMessage,
    shuffle,
    prepareUserIdForMessage,
    timeLeft,
} = require("./../services/helpers");
const {db} = require("../../firebase");
const {
    getStarted,
    getJoined,
    setMaxJoined,
    setStarted,
    getSingles, getMaxJoined,
} = require("../services/shared");
const {addPlayerToGame} = require("./addPlayer");
const {gifSearch} = require("../services/giphy");
const {buildScoringBlocks} = require("./scoring");

/**
 * Handles start command
 * @param {string} user
 * @param {boolean} isSingle
 * @return {Promise<void>}
 */
const handleStart = async (user, isSingle) => {
    if (getStarted()) {
        console.log(
            user + " is trying to start another game" +
            isSingle ? " as single." : ".",
        );
        sendSlackMessage("Already another game.");
    } else {
        console.log("Starting game.");
        await startGame(user);
        await addPlayerToGame(user, isSingle);
    }
};

/**
 * Handles force start command
 */
const handleForceStart = async () => {
    const joined = await getJoined();
    console.log(joined.length);
    if (joined.length >= 2) {
        setMaxJoined(joined.length);
        console.log(getMaxJoined());
        start();
    }
};


/**
 * Starts game
 * @param {string} user
 * @return {Promise<void>}
 */
const startGame = async (user) => {
    timeLeft(120000);
    setStarted(true);

    sendSlackMessage(
        "Game started by " +
        "<@" + user + ">" +
        " time left: " + timeLeft() +
        ", HURRY <!channel>",
    );
};

/**
 * start game
 */
const start = () => {
    shuffleTeams().then((teams) => {
        lockInGame(teams);
    });
};


/**
 * returns shuffled teams
 * @return {Promise<*|*[]>}
 */
const shuffleTeams = async () => {
    let teams;
    let joined = await getJoined();
    const singles = getSingles();
    // split into teams and shuffle, save as current game
    if (singles.length === 1 && joined.length === 3) {
        console.log("found singles", singles);
        // if single, then loop through single,
        // find index in joined, and set these to own team
        const singleIndex = joined.findIndex(
            (player) => {
                return player.isSingle;
            },
        );

        const withoutSingle = [...joined];
        withoutSingle.splice(singleIndex, 1);
        teams = [
            [joined[singleIndex]],
            shuffle(withoutSingle),
        ];
    } else {
        joined = shuffle(joined);
        const half = Math.ceil(joined.length / 2);

        teams = [
            joined.slice(0, half),
            joined.slice(half),
        ];
    }

    joined = shuffle(teams);
    joined.time = Date.now();
    await db.ref("current_game").set(joined);
    return joined;
};


/**
 * Lock current game to current players
 * @param {[]} teams
 */
const lockInGame = async (teams) => {
    console.log("locking in game");

    const joinedForMessage = teams.map((team, index) => {
        let message = "team " +
            (index ? ":red_circle:" : ":large_blue_circle:") + ": ";
        message += team.map((player) => {
            if (player.userId) {
                return prepareUserIdForMessage(player.userId);
            }
        });
        return message;
    });
    sendSlackMessage(
        "GAME FILLED by " +
        joinedForMessage.join(", ") +
        ". Post result to start new game.",
    );

    sendSlackMessage(await gifSearch("game on"));
    await buildScoringBlocks();
};

module.exports = {
    handleStart,
    handleForceStart,
    start,
    shuffleTeams,
    lockInGame,
};
