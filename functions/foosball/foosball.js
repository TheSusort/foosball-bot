const {
  shuffle,
  prepareUserIdForMessage,
  sendSlackMessage,
} = require("./helpers");

const {db} = require("../firebase");
// const {Timer} = require("./helpers");

let started = false;
let joined = [];
let maxJoined = 4;
let time;
let users = {};
let single = [];

/* eslint-disable */
const documentation =
    "**Fussball bot commands** \n" +
    "```" +
    "   start                     start game \n" +
    "   start single              start game as single\n" +
    "   join                      join game \n" +
    "   join single               join game as single \n" +
    "   /result [int] [int]       end game and log result \n" +
    "   /time                     timers have been disabled \n" +
    "   help|/help                show commands \n" +
    "   /username [string]        set new username \n" +
    "   /add 2v1|single|[]        test command for testing modes \n" +
    "   force start               experimental feature to start game with currently\n" +
    "                             joined players \n" +
    "   stop                      force stops the game \n" +
    "   status                    gets current status \n" +
    "   test [int] [int] [bool]   test rating system. input your score, opponents \n" +
    "                             score and win(true/false)" +
    "```"

;
/* eslint-enable */

const handleCommands = async (text, user) => {
  let playerString;
  switch (text) {
    case "start":
      if (!started) {
        console.log("Starting game.");
        await startGame(user);
        await addPlayerToGame(user, false);
      } else {
        console.log(user + " is trying to start another game.");
        sendSlackMessage("Already another game.");
      }
      break;

    case "start single":
      if (!started) {
        console.log("Starting a game as single.");

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
        start();
      }
      break;

    case "join":
      console.log(user + " trying to join");
      if (started) {
        if (joined.length < maxJoined) {
          if (!joined.includes(user)) {
            await addPlayerToGame(user, false);
          } else {
            sendSlackMessage("Already joined");
          }
        } else {
          sendSlackMessage("No more room");
        }
      } else {
        handleCommands("start", user);
      }
      break;

    case "join single":
      if (started) {
        if (joined.length <= maxJoined - 2) {
          if (!joined.includes(user)) {
            await addPlayerToGame(user, true);
          } else {
            sendSlackMessage("Already joined");
          }
        } else {
          sendSlackMessage("No more room");
        }
      } else {
        handleCommands("start single", user);
      }
      break;

    case "help":
      sendSlackMessage(
          "<@" + user + "> requested help :smirk: \n" + documentation,
      );
      break;

    case "user":
      getUser(user).then((currentUser) => {
        sendSlackMessage(
            prepareUserIdForMessage(user) +
                    " is going by the username " +
                    currentUser.name,
        );
      });
      break;

    case "timeleft":
      sendSlackMessage(timeLeft());
      break;

    case "leave":
      sendSlackMessage("No one leaves");
      break;

    case "stop":
      stopGame();
      break;

    case "status":
      playerString = joined.map(
          (player) => prepareUserIdForMessage(player.userId),
      ).join(", ");

      sendSlackMessage(
          "STATUS \n" +
                "Game started: " + started + "\n" +
                "participants: " + (playerString === "" ? "none" : playerString) +
                "\n" +
                "Spots left: " + (maxJoined - joined.length) + "\n" +
                "Timer: " + timeLeft(),
      );
      break;
  }
  let score;
  switch (true) {
    case /^test.*/.test(text):
      console.log(text);
      score = text.split("test ")[1];
      sendSlackMessage(
          "new rating for : " + Number(score.split(" ")[0]) + ": " +
                calculateNewRating(
                    Number(score.split(" ")[0]),
                    Number(score.split(" ")[1]),
                    Boolean(score.split(" ")[2]),
                ) +
                ", and new rating for : " + Number(score.split(" ")[1]) + ": " +
                calculateNewRating(
                    Number(score.split(" ")[1]),
                    Number(score.split(" ")[0]),
                    !score.split(" ")[2],
                ),
      );
      break;
  }

  db.ref("joined").off();
};

/**
 * Adds player to game
 * @param {string} playerName
 * @param {boolean} isSingle
 * @return {Promise<void>}
 */
const addPlayerToGame = async (playerName, isSingle) => {
  // add to joined
  console.log(maxJoined);
  const user = await getUser(playerName);
  joined.push(user);
  db.ref("joined").push(user);


  if (isSingle) {
    single.push(playerName);
    maxJoined--;
  }
  // if has enough players
  if (joined.length === maxJoined) {
    start();
  } else {
    sendSlackMessage(
        "<@" + playerName + ">" +
            " joined" + (isSingle ? " as single" : "") + ", " +
            (maxJoined - joined.length) +
            " space(s) left" +
            ", time left: " + timeLeft(),
    );
  }
};

/**
 * returns shuffled teams
 * @return {Promise<*|*[]>}
 */
const shuffleTeams = async () => {
  let teams;
  // split into teams and shuffle, save as current game
  if (single.length === 1 && joined.length === 3) {
    // if single, then loop through single,
    // find index in joined, and set these to own team
    const singleIndex = joined.findIndex((x) => x.userId === single[0]);
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

  await db.ref("current_game").set(joined);
  return joined;
};

/**
 * Starts game
 * @param {string} user
 * @return {Promise<void>}
 */
const startGame = async (user) => {
  timeLeft(120000);
  started = true;

  sendSlackMessage(
      "Game started by " +
        "<@" + user + ">" +
        " time left: " + timeLeft() +
        ", HURRY @here",
  );
};

/**
 * Force start game
 */
const start = () => {
  shuffleTeams().then((teams) => {
    lockInGame(teams);
  });
};

/**
 * Lock current game to current players
 * @param {[]} teams
 */
const lockInGame = (teams) => {
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
};

/**
 * Stops game
 */
const stopGame = () => {
  db.ref("joined").off();
  db.ref("current_game").remove().then(() => {
    db.ref("joined").remove().then(() => {
      started = false;
      joined = [];
      single = [];
      timeLeft(null);
      maxJoined = 4;
      sendSlackMessage("Stopped");
    });
  });
};


/**
 * Handle result
 * @param {string} text
 * @return {Promise<void>}
 */
const handleResult = async (text) => {
  try {
    if (joined.length) {
      await handleScore(text, joined);
    } else {
      const ref = db.ref("current_game");
      ref.once("value")
          .then((snapshot) => {
            if (snapshot.val()) {
              joined = snapshot.val();
              handleScore(text, joined);
            }
          });
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * Handle result post and update db
 * @param {string} text
 * @param {[]} teams
 * @return {Promise<string>}
 */
const handleScore = async (text, teams) => {
  const scores = text.split(" ");
  console.log("scores: ", scores);

  for (const score in scores) {
    if (!Number.isInteger(Number(score))) {
      return "Enter result of match '/result [int] [int]'";
    }
  }

  if (scores.length === 2) {
    await submitGame(
        scores,
        teams,
    );

    let scoreText = scores[0] + " - " + scores[1] + " :ez::clap_gif:";
    if (Number(scores[0]) > Number(scores[1])) {
      scoreText += buildResultMessage(teams[0]);
    } else {
      scoreText += buildResultMessage(teams[1]);
    }

    sendSlackMessage(scoreText);
    timeLeft(null);
    joined = [];
    started = false;
  } else {
    return "Enter result of match '/result [int] [int]'";
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
 * Build teams
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


  // update users
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
      team.newDeltaRating = newCombinedRating - team.combinedRating;
      return team;
    });

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

    db.ref("users").set(users).then(() => console.log("users saved"));

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

/**
 * gets user
 * @param {string} userId
 * @return {Promise<DataSnapshot|*>}
 */
const getUser = async (userId) => {
  console.log(userId + ": " + users[userId]);
  if (users && users[userId]) {
    return users[userId];
  } else {
    try {
      const userFromDb = await db.ref("users/" + userId).once("value")
          .then((snapshot) => {
            console.log(userId + " from DB: " + snapshot.val());
            return snapshot.val();
          });

      if (userFromDb) {
        return userFromDb;
      } else {
        return await createUser(userId);
      }
    } catch (e) {
      console.error(e);
    }
  }
};

/**
 * gets all users
 * @return {Promise<void>}
 */
const getAllUsers = async () => {
  console.log("getting users");

  if (!started) {
    const ref = db.ref("users");
    await ref.once("value")
        .then((snapshot) => {
          if (snapshot.val()) {
            users = snapshot.val();
            console.log("all users retrieved");
          }
          return users;
        });
  }
};

const getJoined = async () => {
  console.log("checking for joined");
  if (joined && joined.length) {
    console.log("found joined in memory");
    started = true;
    return joined;
  } else {
    await db.ref("joined").once("value", (snap) => {
      if (snap.val()) {
        console.log("found joined in db");
        joined = Object.values(snap.val());
        started = true;
        return joined;
      }
      return [];
    });
  }
};

/**
 * starts getting users
 * @return {Promise<void>}
 */
const syncHandler = async () => {
  await getAllUsers();
  await getJoined();
  console.log(joined);
  /*
        db.ref("current_game").on("child_added", (r) => {
          sendSlackMessage(r.val())
        });*/
  db.ref("joined").on("child_added", (r) => {
    console.log(r.val() + " added to joined");
  });
};

/**
 * create user
 * @param {string} userId
 * @return {Promise<*>}
 */
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

/**
 * Update user
 * @param {string} userId
 * @param {number} win
 * @param {number} newRating
 */
const updateUser = async (userId, win, newRating) => {
  if (!users[userId]) {
    userId = await createUser(userId);
  }
  users[userId].wins += win;
  users[userId].rating = newRating;
  users[userId].totalGames++;
};

/**
 * Update username
 * @param {string} userId
 * @param {string} newUserName
 */
const updateUserName = (userId, newUserName) => {
  if (users[userId]) {
    db.ref("users").child(userId).update({"name": String(newUserName)});
  }
};

/**
 * gets time left of timers
 * @param {number|null} int
 * @return {string}
 */
const timeLeft = (int) => {
  if (int > 0) {
    // time = new Timer(() => stopGame(), int)
  } else if (int === null) {
    time = null;
  }
  if (time) {
    return "Time left: " + time.getTimeLeft();
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
exports.timeLeft = timeLeft;
exports.syncHandler = syncHandler;

exports.getUser = getUser;
exports.getAllUsers = getAllUsers;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.updateUserName = updateUserName;

exports.documentation = documentation;
exports.joined = joined;
exports.users = users;
exports.maxJoined = maxJoined;
