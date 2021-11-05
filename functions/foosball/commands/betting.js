const {getUser} = require("../services/users");
const {db, firebase} = require("../../firebase");
const {
    sendSlackMessage,
    prepareUserIdForMessage,
    pickRandomFromArray,
    coins,
} = require("../services/helpers");
const {getCurrentGame, getCurrentScore} = require("./scoring");

const registerBet = async (text, userId) => {
    const user = await getUser(userId);
    const [command, team, bet] = text.split(" ");
    const score = await getCurrentScore();
    console.log(command, team, bet);
    if (Object.values(score).join("-") !== "0-0") {
        sendSlackMessage(
            prepareUserIdForMessage(userId) +
            " can't place bets on a game that is started.",
        );
        return;
    }

    if (team === "red" || team === "blue") {
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
                "Betting is a sport for gentlemen, and ya poor, " +
                prepareUserIdForMessage(userId),
            );
        }
    } else {
        sendSlackMessage(
            "Have to bet on red or blue, " + prepareUserIdForMessage(userId),
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
    const winner = result > 0 ? "blue" : "red";
    console.log(result, winner);
    if (!result) {
        sendSlackMessage(result + " has to be a valid delta");
        return;
    }

    const bets = await db.ref("bets").once("value").then((snapshot) => {
        // console.log(snapshot.val());
        if (snapshot.val().red || snapshot.val().blue) {
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
                            sendSlackMessage(
                                prepareUserIdForMessage(sBet.userId) +
                                " won bet! Dishing out " +
                                Math.round(sBet.amount * bets[team].odds) +
                                " " + pickRandomFromArray(coins));

                            if (betUpdates["users/" + [sBet.userId] + "/coins"]) {
                                betUpdates["users/" + [sBet.userId] + "/coins"] =
                                    firebase.database.ServerValue.increment(
                                        betUpdates["users/" + [sBet.userId] + "/coins"][".sv"].increment + sBet.amount * bets[team].odds,
                                    );
                            } else {
                                betUpdates["users/" + [sBet.userId] + "/coins"] =
                                    firebase.database.ServerValue.increment(
                                        sBet.amount * bets[team].odds,
                                    );
                            }
                        } else {
                            sendSlackMessage(
                                prepareUserIdForMessage(sBet.userId) +
                                " lost and the house gets their " +
                                sBet.amount + " " + pickRandomFromArray(coins));
                            houseAmount += sBet.amount;
                        }
                    }
                }
            }
        }
    }
    /* eslint-enable max-len */
    betUpdates["house/coins"] =
        firebase.database.ServerValue.increment(houseAmount);
    console.log(betUpdates);
    await db.ref("/").update(betUpdates);
    await db.ref("bets/").remove();
};

const calculateOdds = async () => {
    const currentGame = await getCurrentGame();

    // starting win chances favor blue,
    // who knows why but blue wins 60% of the matches
    const odds = {
        blue: 0.07,
        red: 0,
    };
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

    // calculate winning chance based on difference in rating
    const ratio = (ratings[0] - ratings[1]) / 400;
    const expectedScores = [1 / (1 + (Math.pow(10, -1 * ratio)))];
    expectedScores.push(1 - expectedScores[0]);

    console.log(expectedScores, odds);

    // subtract 20% less chance of winning if single player
    // @TODO: get stats on single player games to use instead of 20%
    const handicap = 0.2;
    if (Math.max(...teamLengths) !== 1) {
        console.log("one team has 1 length");
        if (teamLengths[0] === 1) {
            console.log("blue team has 1 length");
            odds.blue += expectedScores[0] - handicap - odds.red;
            odds.red = 1 - odds.blue;
        } else {
            console.log("red team has 1 length");
            odds.red += 1 - expectedScores[0] - handicap - odds.blue;
            odds.blue = 1 - odds.red;
        }
    } else {
        odds.blue += expectedScores[0];
        odds.red += 1 - odds.blue;
    }

    // round winning chances
    for (const odd in odds) {
        if ({}.hasOwnProperty.call(odds, odd)) {
            odds[odd] = roundProbablity(odds[odd]);
        }
    }

    sendSlackMessage(
        "*Winning chances* \n" +
        "BLUE: " + (odds.blue * 100) + "%\n" +
        "RED: " + (odds.red * 100) + "%",
    );

    sendSlackMessage(
        "*Odds* \n" +
        "BLUE:" + roundProbablity(1 / odds.blue) + "\n" +
        "RED:" + roundProbablity(1 / odds.red),
    );

    sendSlackMessage(
        "*Placing bets* \n" +
        "bet [team] [amount]",
    );

    await db.ref("bets").update({
        "blue/odds": roundProbablity(1 / odds.blue),
        "red/odds": roundProbablity(1 / odds.red),
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

module.exports = {
    registerBet,
    placeBet,
    resolveBets,
    calculateOdds,
    handleWallet,
};
