const {db} = require("../../firebase");
const {
    sendSlackMessage,
    prepareUserIdForMessage,
} = require("../services/helpers");
const {updateUser} = require("../services/users");
const {
    getUsers,
} = require("../services/shared");
const {stopGame} = require("./stop");
const {getCurrentGame} = require("./scoring");
const {resolveBets, addCoinsForJoining} = require("./betting");

const finishGame = async () => {
    await db.ref("current_score")
        .once("value")
        .then(async (scores) => {
            await handleResult(scores.val().join(" "));
        });
};

/**
 * Handle result
 * @param {string} text
 * @param {string} user
 * @return {Promise<void>}
 */
const handleResult = async (text, user = "Slæckball") => {
    try {
        const currentGame = await getCurrentGame();
        await handleScore(text, currentGame, user);
    } catch (error) {
        console.error(error);
    }
};

/**
 * Handle result post and update db
 * @param {string} text
 * @param {[]|DataSnapshot} teams
 * @param {string} user
 * @return {Promise<string>|null}
 */
const handleScore = async (text, teams, user) => {
    const scores = text.split(" ");
    let finished = false;
    console.log("scores: ", scores);
    const errorString = prepareUserIdForMessage(user) +
        " is a great QA worker: ";

    if (scores.length !== 2) {
        sendSlackMessage(errorString + text + "has to be two scores");
        return;
    }
    if (scores[0] === scores[1]) {
        sendSlackMessage(errorString + text + " can't be a tie");
        return;
    }

    for (const score of scores) {
        if (parseInt(score) === 10) {
            finished = true;
        }

        if (
            parseInt(score) < 0 ||
            parseInt(score) > 10
        ) {
            sendSlackMessage(
                errorString + text + " has to be numbers equal or below 10",
            );
            return;
        }
    }

    if (finished) {
        await submitGame(
            scores,
            teams,
        );

        let scoreText = scores[0] + " - " +
            scores[1] + " :slackball::clap_gif:";
        if (parseInt(scores[0]) > parseInt(scores[1])) {
            scoreText += buildResultMessage(teams[0]);
        } else {
            scoreText += buildResultMessage(teams[1]);
        }
        sendSlackMessage(
            prepareUserIdForMessage(user) + " is registering score: " + text,
        );
        sendSlackMessage(scoreText);
        stopGame();
    } else {
        sendSlackMessage(errorString + text + " you're not finished");
    }
};

/**
 * Builds result message
 * @param {[]} team
 * @return {string}
 */
const buildResultMessage = (team) => {
    let text = "";
    console.log("team for building message: ", team);
    team.map((player, index) => {
        text += prepareUserIdForMessage(player.userId);
        if (index !== team.length - 1) {
            text += " and ";
        }
    });
    return text;
};

/**
 * Build teams for result calculation
 * @param {[]} players
 * @param {[]} result
 * @return {Promise<*>}
 */
const buildTeams = async (players, result) => {
    return players.map((teams, index) => {
        return {
            players: players[index],
            resultValue: Number(result[index]),
        };
    });
};

/**
 * Submits game and saves values
 * @param {[]} result
 * @param {[]} teams
 * @return {Promise<void>}
 */
const submitGame = async (result, teams) => {
    const winningScore = 10;

    const time = teams.time;
    delete teams.time;
    const timeEnd = Date.now();
    const elapsed = ((timeEnd - time) / 1000);
    await getUsers();
    buildTeams(Object.values(teams), result).then(async (teams) => {
        // calculate combined ratings
        teams.map((team) => {
            team.combinedRating = 0;
            team.players.map((player) => {
                team.combinedRating += player.rating;
                return player;
            });

            team.combinedRating = team.combinedRating / team.players.length;
            return team;
        });

        /**
         * new ratings
         * 1. get new combined rating
         * 2. delta of combined rating is delta for each players new rating
         */

        teams.map((team, index) => {
            team.didWin = team.resultValue >= winningScore ? 1 : 0;
            const newCombinedRating = calculateNewRating(
                team.combinedRating,
                teams[Number(!index)].combinedRating,
                team.didWin,
            );
            team.newDeltaRating = Math.round(
                newCombinedRating - team.combinedRating,
            );
            return team;
        });

        // set new stats for users
        teams.map((team) => {
            team.players.map(async (player) => {
                return await updateUser(
                    player.userId,
                    team.didWin,
                    player.rating + team.newDeltaRating,
                );
            });
            return team;
        });

        // create game in games
        const uid = new Date().getTime().toString();
        const game = {
            uid,
            teams: [
                teams[0].players.map((player) => player.userId),
                teams[1].players.map((player) => player.userId),
            ],
            result: result[0] + "-" + result[1],
            delta: teams[0].newDeltaRating,
            time: elapsed,
        };

        // update db
        db.ref("users").set(getUsers()).then(() => console.log("users saved"));
        db.ref("games").push(game).then(() => console.log("game saved"));
        await resolveBets(teams[0].newDeltaRating);
        await addCoinsForJoining(teams);

        stopGame();
    });
};

/**
 * Calculates new rating
 * @param {number} rating
 * @param {number} oppRating
 * @param {number} result
 * @return {number}
 */
const calculateNewRating = (rating, oppRating, result) => {
    const ratio = (oppRating - rating) / 400;
    const expectedScore = 1 / (1 + (Math.pow(10, ratio)));
    return Math.round(rating + (40 * (result - expectedScore)));
};

module.exports = {
    finishGame,
    handleResult,
    handleScore,
    submitGame,
    buildTeams,
    buildResultMessage,
    calculateNewRating,
};
