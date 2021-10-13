const {
    shuffle,
    prepareUserIdForMessage,
    sendSlackMessage,
} = require("./helpers");

const {db} = require("../firebase");
const {Timer} = require("./helpers");

let started = false;
let joined = [];
let maxJoined = 4;
let timeLeft;
let keepAlive;
let users = {};
let single = [];

const documentation = "Fussball bot commands \n" +
    "   *start*                        start game \n" +
    "   *join*                          join game \n" +
    "   *join single*               join game as single \n" +
    "   */result [int] [int]*     end game and log result \n" +
    "   */time*                       get time left until timeout \n" +
    "   */help*                       show commands \n";


const handleCommands = async (text, user) => {
    switch (text) {
        case "start":
            if (!started) {
                console.log("Starting game.");
                await startGame(user);
                await addPlayerToGame(user);

                break;
            } else {
                console.log(user + " is trying to start another game.");
                sendSlackMessage("Already another game.");
                break;
            }
        case "start single":
            if (!started) {
                console.log("Starting game.");
                single.push(user)
                await startGame(user);
                await addPlayerToGame(user, true);

                break;
            } else {
                console.log(user + " is trying to start another game.");
                sendSlackMessage("Already another game.");
                break;
            }

        case "force start":
            if (joined.length >= 2) {
                maxJoined = joined.length;
                shuffleTeams().then((teams) => {
                    lockInGame(teams)
                })
            }
            break;
        case "join":
            console.log(user + " trying to join");
            console.log(started, joined.length, !joined.includes(user))
            if (started && joined.length < maxJoined /*&& !joined.includes(user)*/) {
                await addPlayerToGame(user);
            } else {
                sendSlackMessage(prepareUserIdForMessage(user) + ", you've already joined ")
            }
            break;
        case "join single":
            // @TODO add check for exisiting user in joined
            if (started && joined.length < maxJoined /*&& !joined.includes(user)*/) {
                single.push(user)
                await addPlayerToGame(user, true);
            }
            break;
        case "help":
            sendSlackMessage(
                "<@" + user + "> requested help :smirk: \n" + documentation
            );
            break;
        case "user":
            getUser(user).then((currentUser) => {
                sendSlackMessage(prepareUserIdForMessage(user) + " is going by the username " + currentUser.name)
            });

            break;

        case "timeleft":
            sendSlackMessage(getTimeLeft());
            break;

        case "leave":
            sendSlackMessage("No one leaves");
            break;

        case "stop":
            sendSlackMessage("You can't stop this");
            break;
    }
};

/**
 * Adds player to game
 * @param playerName
 * @param isSingle
 * @returns {Promise<void>}
 */
const addPlayerToGame = async (playerName, isSingle) => {
    // add to joined
    joined.push(await getUser(playerName));
    if(isSingle) {
        maxJoined--;
    }
    // if has enough players
    if (joined.length === maxJoined) {

        shuffleTeams().then((teams) => {
            lockInGame(teams)
        })

    } else {
        sendSlackMessage(
            "<@" + playerName + ">" +
            " joined, " + (maxJoined - joined.length) +
            " space(s) left" +
            ", time left: " + getTimeLeft()
        );
    }

};

const shuffleTeams = async () => {
    let teams;
    //split into teams and shuffle, save as current game
    console.log(single.length, joined.length)
    if (single.length === 1 && joined.length === 3) {
        // if single, then loop through single, find index in joined, and set these to own team
        let singleIndex = joined.findIndex(x => x.userId === single[0]);
        let withoutSingle = [...joined];
        withoutSingle.splice(singleIndex, 1);
        teams = [
            [joined[singleIndex]],
            shuffle(withoutSingle)
        ]
    } else {
        joined = shuffle(joined);
        let half = Math.ceil(joined.length / 2)

        teams = [
            joined.slice(0, half),
            joined.slice(half)
        ]
    }
    joined = shuffle(teams);

    await db.ref("current_game").set(joined)
    return joined

}

/**
 * Starts game
 * @param user
 * @returns {Promise<void>}
 */
const startGame = async (user) => {
    timeLeft = new Timer(() => stopGame(), 120000);
    started = true;

    sendSlackMessage(
        "Game started by " +
        "<@" + user + ">" +
        " time left: " + getTimeLeft() +
        ", HURRY @here"
    );
};

const forceStart = () => {
    shuffleTeams().then((teams) => {
            lockInGame(teams)
        }
    )
}

const lockInGame = (teams) => {
    let joinedForMessage = [].concat.apply([], teams)

    joinedForMessage = joinedForMessage.map((player) => {
        return prepareUserIdForMessage(player.userId)
    });

    console.log(joinedForMessage)
    sendSlackMessage(
        "GAME FILLED by " +
        joinedForMessage.join(", ") +
        ". Post result to start new game."
    );
    timeLeft = null;
    console.log(getTimeLeft())
}

/**
 * Stops game
 */
const stopGame = () => {
    started = false;
    joined = [];
    timeLeft = null;
    keepAlive = null;
    sendSlackMessage("Timed out.");
};


/**
 * Handle result
 * @param text
 * @returns {Promise<void>}
 */
const handleResult = async (text) => {
    try {
        if (joined.length) {
            await handleScore(text, joined);
        } else {
            let ref = db.ref("current_game")
            ref.once("value")
                .then((snapshot) => {
                    if (snapshot.val()) {
                        console.log(snapshot.val())
                        joined = snapshot.val();
                        handleScore(text, joined);
                    }
                });
        }

    } catch (error) {
        console.error(error)
    }
};

/**
 * Handle result post and update db
 * @param text
 * @param teams
 * @returns {Promise<string>}
 */
const handleScore = async (text, teams) => {
    const scores = text.split(" ");
    console.log("scores: ", scores)

    for (const score in scores) {
        if (!Number.isInteger(Number(score))) {
            return "Enter result of match '/result [int] [int]'";
        }
    }

    if (scores.length === 2) {
        await submitGame(
            scores,
            teams
        );

        let scoreText = scores[0] + " - " + scores[1] + " :ez::clap_gif:";
        if (Number(scores[0]) > Number(scores[1])) {
            scoreText += buildResultMessage(teams[0])

        } else {
            scoreText += buildResultMessage(teams[1])
        }

        sendSlackMessage(scoreText);
        timeLeft = null;
        joined = [];
        started = false;
    } else {
        return "Enter result of match '/result [int] [int]'";
    }
}

const buildResultMessage = (team) => {
    let text = '';
    console.log("team for building message: ",team)
    team.map((player, index) => {
        text += prepareUserIdForMessage(player.userId);
        if (index !== team.length - 1) {
            text += " and "
        }
    })
    return text;
}

const buildTeams = async (players, result) => {

    return players.map((teams, index) => {
        return {
            players: players[index],
            resultValue: Number(result[index])
        }
    })
}

const submitGame = async (result, teams) => {
    const winningScore = 10;


    // update users
    buildTeams(teams, result).then(teams => {

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
                team.didWin
            );
            team.newDeltaRating = newCombinedRating - team.combinedRating;
            return team;
        });

        teams.map((team) => {
            team.players.map((player) => {
                updateUser(
                    player.userId,
                    team.didWin,
                    player.rating + team.newDeltaRating
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

        db.ref("users").set(users).then(() => console.log("users saved"));

        db.ref("games").push(game).then(() => console.log("game saved"));
        db.ref("current_game").set([]).then(() => console.log("current game cleared"));
    })
};

const calculateNewRating = (rating, oppRating, result) => {
    const ratio = (oppRating - rating) / 400;
    const expectedScore = 1 / (1 + (Math.pow(10, ratio)));
    return Math.round(rating + (40 * (result - expectedScore)));
};

const getUser = async (userId) => {
    console.log(userId + ": " + users[userId])
    if (users && users[userId]) {
        return users[userId];
    } else {
        try {
            let userFromDb = await db.ref("users/" + userId).once("value")
                .then((snapshot) => {
                    console.log(userId + " from DB: " + snapshot.val())
                    return snapshot.val()
                })

            if (userFromDb) {
                return userFromDb
            } else {
                return await createUser(userId)
            }
        } catch (e) {
            console.error(e)
        }
    }
};

const getAllUsers = async () => {
    console.log("getting users");
    console.log(getTimeLeft())

    if (!started) {
        const ref = db.ref("users");
        await ref.once("value")
            .then((snapshot) => {
                if (snapshot.val()) {
                    users = snapshot.val();
                    console.log(users)
                }
                return users;
            });
    }
};

const syncHandler = async () => {
    await getAllUsers();

    db.ref("current_game").on("child_added", (r) => {
        console.log(r.val())
    })
};

const createUser = async (userId) => {
    if (!users[userId]) {
        const newPlayer = {
            userId: userId,
            name: "player" + userId,
            wins: 0,
            totalGames: 0,
            rating: 1000,
        };
        users[userId] = newPlayer;
        db.ref("users")
            .update({[userId]: newPlayer})
            .then(() => console.log(userId + " saved"));
    }
    return users[userId];
};

const updateUser = (userId, win, newRating) => {
    if (!users[userId]) {
        userId = createUser(userId);
    }
    users[userId].wins += win;
    users[userId].rating = newRating;
    users[userId].totalGames++;
};

const updateUserName = (userId, newUserName) => {
    if (users[userId]) {
        db.ref("users").child(userId).update({"name": String(newUserName)});
    }
};
const getTimeLeft = () => {
    if (timeLeft) {
        return "Time left: " + timeLeft.getTimeLeft();
    }
    return "No timers running";
};


exports.handleCommands = handleCommands;
exports.addPlayerToGame = addPlayerToGame;
exports.startGame = startGame;
exports.stopGame = stopGame;
exports.handleResult = handleResult;
exports.submitGame = submitGame;
exports.calculateNewRating = calculateNewRating;
exports.getTimeLeft = getTimeLeft;
exports.syncHandler = syncHandler;
exports.forceStart = forceStart;

exports.getUser = getUser;
exports.getAllUsers = getAllUsers;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.updateUserName = updateUserName;

exports.documentation = documentation;
exports.joined = joined;
exports.users = users;
exports.timeLeft = timeLeft;
exports.maxJoined = maxJoined;
