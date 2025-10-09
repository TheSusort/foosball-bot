const {getUser} = require("../services/users");
const {db} = require("../../firebase");
const {
    sendSlackMessage,
    prepareUserIdForMessage,
    pickRandomFromArray,
    coins,
} = require("../services/helpers");
const {getCurrentGame, getCurrentScore} = require("./scoring");
const {getSoloWinChance, getBlueWinChance} = require("../stats/stats");
const {getTeamColors} = require("../services/colors");

const registerBet = async (text, userId) => {
    const user = await getUser(userId);
    const [command, team, bet] = text.split(" ");
    const score = await getCurrentScore();
    const colors = getTeamColors();
    console.log(command, team, bet, score);
    if (score !== "0 - 0") {
        sendSlackMessage(
            prepareUserIdForMessage(userId) +
            " can't place bets on a game that is started.",
        );
        return;
    }

    if (team === colors.team1.color || team === colors.team2.color) {
        if (!parseInt(bet)) {
            sendSlackMessage(
                "Have to bet real " + pickRandomFromArray(coins) +
                ", " + prepareUserIdForMessage(userId),
            );
            return;
        }

        if (!Object.prototype.hasOwnProperty.call(user, "coins")) {
            await db.ref("users").update({
                [userId + "/coins"]: 1000,
            });
            user.coins = 1000;
        }
        console.log(user);

        if (parseInt(bet) <= user.coins) {
            await placeBet(parseInt(bet), team, user);
        } else {
            sendSlackMessage(
                "Betting is a sport for distinguished high-rollers, " +
                "and ya poor, " +
                prepareUserIdForMessage(userId),
            );
        }
    } else {
        sendSlackMessage(
            `Have to bet on ${colors.team1.color} or ${colors.team2.color}, ` +
            prepareUserIdForMessage(userId),
        );
    }
};

const placeBet = async (bet, team, user) => {
    await db.ref("users").update({
        [user.userId + "/coins"]: user.coins - bet,
    });
    await db.ref("bets/" + team + "/bets")
        .push({amount: bet, userId: user.userId});

    sendSlackMessage(
        prepareUserIdForMessage(user.userId) + " registered a bet on " +
        team + " for " + bet + " " + pickRandomFromArray(coins),
    );
};

const resolveBets = async (string) => {
    const result = parseInt(string);
    const colors = getTeamColors();
    const winner = result > 0 ? colors.team1.color : colors.team2.color;
    console.log(result, winner);
    if (!result) {
        sendSlackMessage(result + " has to be a valid delta");
        return;
    }

    const bets = await db.ref("bets").once("value").then((snapshot) => {
        // console.log(snapshot.val());
        if (snapshot.val()[colors.team1.color] ||
            snapshot.val()[colors.team2.color]) {
            return snapshot.val();
        }
    });
    const betUpdates = {};
    let houseAmount = 0;

    /* eslint-disable max-len */
    if (bets) {
        for (const team in bets) {
            if ({}.hasOwnProperty.call(bets, team)) {
                for (const bet in bets[team].bets) {
                    if ({}.hasOwnProperty.call(bets[team].bets, bet)) {
                        const sBet = bets[team].bets[bet];
                        if (team === winner) {
                            await db.ref("bet-history/")
                                .push({
                                    team: team,
                                    userId: sBet.userId,
                                    amount: sBet.amount,
                                    result: sBet.amount * bets[team].odds,
                                    odds: bets[team].odds,
                                });

                            sendSlackMessage(
                                prepareUserIdForMessage(sBet.userId) +
                                " won bet! Dishing out " +
                                Math.round(sBet.amount * bets[team].odds) +
                                " " + pickRandomFromArray(coins));

                            // Get current coins and add winnings
                            const userRef = db.ref("users/" + sBet.userId + "/coins");
                            const snapshot = await userRef.once("value");
                            const currentCoins = snapshot.val() || 0;
                            const winnings = sBet.amount * bets[team].odds;

                            betUpdates["users/" + [sBet.userId] + "/coins"] = currentCoins + winnings;
                        } else {
                            sendSlackMessage(
                                prepareUserIdForMessage(sBet.userId) +
                                " lost and the house gets their " +
                                sBet.amount + " " + pickRandomFromArray(coins));
                            houseAmount += sBet.amount;

                            await db.ref("bet-history/")
                                .push({
                                    team: team,
                                    userId: sBet.userId,
                                    amount: sBet.amount,
                                    result: 0,
                                    odds: bets[team].odds,
                                });
                        }
                    }
                }
            }
        }
    }
    /* eslint-enable max-len */
    // Get current house coins and add house amount
    const houseRef = db.ref("house/coins");
    const houseSnapshot = await houseRef.once("value");
    const currentHouseCoins = houseSnapshot.val() || 0;

    betUpdates["house/coins"] = currentHouseCoins + houseAmount;
    console.log(betUpdates);
    await db.ref("/").update(betUpdates);

    await db.ref("bets/").remove();
};

const calculateOdds = async () => {
    const currentGame = await getCurrentGame();
    const colors = getTeamColors();

    const teamLengths = [];
    const ratings = [];

    delete currentGame.time;

    // get ratings and team lengths
    for (const team in currentGame) {
        if ({}.hasOwnProperty.call(currentGame, team)) {
            let rating = 0;
            for (const player in currentGame[team]) {
                if ({}.hasOwnProperty.call(currentGame[team], player)) {
                    rating += Number(currentGame[team][player].rating);
                }
            }
            teamLengths.push(Object.values(currentGame[team]).length);
            ratings.push(rating / Object.values(currentGame[team]).length);
        }
    }

    // calculate winning chance based on difference in rating (ELO formula)
    const ratio = (ratings[0] - ratings[1]) / 400;
    const expectedScores = [1 / (1 + (Math.pow(10, -1 * ratio)))];
    expectedScores.push(1 - expectedScores[0]);

    const odds = {
        [colors.team1.color]: expectedScores[0],
        [colors.team2.color]: expectedScores[1],
    };

    console.log("Base odds from ELO:", expectedScores);

    // Apply handicap for 2v1 games based on historical solo performance
    // Cap the handicap multiplier to prevent extreme swings
    const is2v1 = Math.max(...teamLengths) === 2 && Math.min(...teamLengths) === 1;
    if (is2v1) {
        const soloWinRate = await getSoloWinChance();
        // Use capped handicap: max adjustment of ±0.15 (was ±0.45 with *3 multiplier)
        const handicap = Math.max(-0.15, Math.min(0.15, (soloWinRate - 0.5) * 1.5));
        console.log(`2v1 detected. Solo win rate: ${soloWinRate.toFixed(2)}, handicap: ${handicap.toFixed(2)}`);

        if (teamLengths[0] === 1) {
            // Team 1 is solo
            odds[colors.team1.color] += handicap;
            odds[colors.team2.color] = 1 - odds[colors.team1.color];
        } else {
            // Team 2 is solo
            odds[colors.team2.color] += handicap;
            odds[colors.team1.color] = 1 - odds[colors.team2.color];
        }
    }

    // Clamp odds to valid range [0.05, 0.95] to prevent extreme/negative values
    for (const team in odds) {
        if ({}.hasOwnProperty.call(odds, team)) {
            odds[team] = Math.max(0.05, Math.min(0.95, odds[team]));
        }
    }

    // Normalize to ensure they sum to 1.0
    const total = odds[colors.team1.color] + odds[colors.team2.color];
    odds[colors.team1.color] = odds[colors.team1.color] / total;
    odds[colors.team2.color] = odds[colors.team2.color] / total;

    console.log("Final odds:", odds);

    // round winning chances
    for (const odd in odds) {
        if ({}.hasOwnProperty.call(odds, odd)) {
            odds[odd] = roundProbablity(odds[odd]);
        }
    }

    sendSlackMessage(
        [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "Placing bets :bowtie:",
                    "emoji": true,
                },
            },
            {
                "type": "divider",
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Place your bets by writing " +
                        "`bet " + colors.team1.color + "/" +
                        colors.team2.color + " [amount]` in the chat.",
                },
            },
            {
                "type": "divider",
            },
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "Active odds :excuseme:",
                    "emoji": true,
                },
            },
            {
                "type": "divider",
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `*${colors.team2.name}* ${colors.team2.emoji} : ` +
                        roundProbablity(1 / odds[colors.team2.color]),
                },
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `*${colors.team1.name}* ${colors.team1.emoji} : ` +
                        roundProbablity(1 / odds[colors.team1.color]),
                },
            },
        ],
    );


    await db.ref("bets").update({
        [`${colors.team1.color}/odds`]: roundProbablity(1 /
            odds[colors.team1.color]),
        [`${colors.team2.color}/odds`]: roundProbablity(1 /
            odds[colors.team2.color]),
    });
};

const roundProbablity = (prob) => {
    return Math.round((prob + Number.EPSILON) * 100) / 100;
};

const handleWallet = async (userId) => {
    const user = await getUser(userId);
    if (Object.prototype.hasOwnProperty.call(user, "coins")) {
        sendSlackMessage(
            prepareUserIdForMessage(userId) + ", your " +
            pickRandomFromArray(coins) + " balance is currently " + user.coins);
    } else {
        sendSlackMessage(
            prepareUserIdForMessage(userId) + ", you don't have any " +
            pickRandomFromArray(coins) +
            ". Place your first bet and recieve 1000 free* " +
            pickRandomFromArray(coins),
        );
    }
};

const addCoinsForJoining = async (teams) => {
    const updates = {};

    for (const team of teams) {
        for (const user of team.players) {
            // Get current coins and add 100
            const userRef = db.ref("users/" + user.userId + "/coins");
            const snapshot = await userRef.once("value");
            const currentCoins = snapshot.val() || 0;

            updates[user.userId + "/coins"] = currentCoins + 100;
        }
    }
    await db.ref("users").update(updates);
};

module.exports = {
    registerBet,
    placeBet,
    resolveBets,
    calculateOdds,
    handleWallet,
    addCoinsForJoining,
};
