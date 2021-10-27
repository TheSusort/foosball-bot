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

const finishGame = async () => {
    await db.ref("current_score")
        .once("value")
        .then((scores) => {
            handleResult(scores.val().join(" "));
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
        const ref = db.ref("current_game");
        ref.once("value")
            .then((snapshot) => {
                if (snapshot.val()) {
                    handleScore(text, snapshot.val(), user);
                }
            });
    } catch (error) {
        console.error(error);
    }
};

/**
 * Handle result post and update db
 * @param {string} text
 * @param {[]} teams
 * @param {string} user
 * @return {Promise<string>}
 */
const handleScore = async (text, teams, user) => {
    const scores = text.split(" ");
    console.log("scores: ", scores);
    const errorString = prepareUserIdForMessage(user) +
        " is a great QA worker: ";
    for (const score in scores) {
        if (
            !Number.isInteger(Number(score)) &&
            Number(score) >= 10
        ) {
            sendSlackMessage(
                errorString + text + " has to be numbers equal or below 10",
            );
        }
    }

    if (scores.length !== 2 || scores[0] === scores[1]) {
        sendSlackMessage(errorString + text + " can't be a tie");
    }

    if (scores.length === 2) {
        await submitGame(
            scores,
            teams,
        );

        let scoreText = scores[0] + " - " +
            scores[1] + " :slackball::clap_gif:";
        if (Number(scores[0]) > Number(scores[1])) {
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
        sendSlackMessage(errorString + text + " both teams needs a score");
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

    buildTeams(teams, result).then((teams) => {
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
            team.players.map((player) => {
                updateUser(
                    player.userId,
                    team.didWin,
                    player.rating + team.newDeltaRating,
                );
                return player;
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
        };

        // update db
        db.ref("users").set(getUsers()).then(() => console.log("users saved"));
        db.ref("games").push(game).then(() => console.log("game saved"));

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
