const {
    sendSlackMessage,
    shuffle,
    prepareUserIdForMessage,
    timeLeft,
    gameStartGifs,
    pickRandomFromArray,
} = require("./../services/helpers");
const {db} = require("../../firebase");
const {
    getStarted,
    getJoined,
    setMaxJoined,
    setStarted,
    getSingles, getMaxJoined, setJoined,
} = require("../services/shared");
const {addPlayerToGame} = require("./addPlayer");
const {gifSearchAsImage} = require("../services/giphy");
const {buildScoringBlocks} = require("./scoring");
const {calculateOdds} = require("./betting");
const {getTeamColors} = require("../services/colors");

/**
 * Handles start command
 * @param {string} user
 * @param {boolean} isSingle
 * @return {Promise<void>}
 */
const handleStart = async (user, isSingle) => {
    console.log(`handleStart called for user ${user},
         isSingle: ${isSingle}, getStarted(): ${getStarted()}`);

    if (getStarted()) {
        console.log(
            user + " is trying to start another game" +
            (isSingle ? " as single." : "."),
        );
        sendSlackMessage("Already another game.");
        return;
    }

    console.log("Starting game.");
    await startGame(user);
    await addPlayerToGame(user, isSingle);
};

/**
 * Handles force start command
 * @param  {string}userId
 * @return {Promise<void>}
 */
const handleForceStart = async (userId) => {
    const joined = await getJoined();
    joined.map((user) => {
        if (user.userId === userId) {
            user.isSingle = true;
        }
        return user;
    });
    await setJoined(joined);
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
        ", HURRY <!channel> write `join` or `join single` to join the game",
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
    let playerIndex = 0;
    const colors = getTeamColors();
    let team1Single = false;
    const joinedForMessage = teams.map((team, index) => {
        const teamColor = index ? colors.team2 : colors.team1;
        let message = "team " + teamColor.emoji + ": ";

        if (!index) {
            team1Single = team.length === 1;
        }

        message += team.map((player, pIndex) => {
            console.log(team1Single, index, pIndex);
            if (player.userId) {
                return " " + (team1Single && index && !pIndex ?
                    playerIndex = playerIndex + 2 : ++playerIndex) +
                    " - " + prepareUserIdForMessage(player.userId);
            }
        });
        return message;
    });
    sendSlackMessage(
        "GAME FILLED by " +
        joinedForMessage.join(", ") +
        ". Post result to start new game.",
    );

    sendSlackMessage(await gifSearchAsImage(pickRandomFromArray(gameStartGifs)));

    await db.ref("current_score").set([0, 0]);
    await buildScoringBlocks();
    await calculateOdds();
};

module.exports = {
    handleStart,
    handleForceStart,
    start,
    shuffleTeams,
    lockInGame,
};
