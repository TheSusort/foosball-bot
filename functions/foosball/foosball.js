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
let users = {};

const documentation = "Fussball bot commands \n" +
    "   *start*                        start game \n" +
    "   *join*                          join game \n" +
    "   *join single*               join game as single \n" +
    "   */result [int] [int]*     end game and log result \n" +
    "   */time*                       get time left until timeout \n" +
    "   */help*                       show commands \n";


const handleCommands = (text, user) => {
  switch (text) {
    case "start":
      if (!started) {
        startGame(user);

        break;
      } else {
        sendSlackMessage("Already another game.");
        break;
      }
    case "join":
      console.log(user + " trying to join");
      // @TODO add check for exisiting user in joined
      if (started && joined.length < maxJoined && !joined.includes(user)) {
        addPlayerToGame(user);
      }
      break;
    case "join single":
      // @TODO add check for exisiting user in joined
      if (started && joined.length < maxJoined && !joined.includes(user)) {
        maxJoined -= 1;
        addPlayerToGame(user);
      }
      break;
    case "help":
      sendSlackMessage(
          "<@" + user + "> requested help :smirk: \n" + documentation
      );
      break;
    case "user":
      getUser(user);
  }
};

const addPlayerToGame = (playerName) => {
  joined.push(playerName);

  getUser(playerName);
  if (joined.length === maxJoined) {
    joined = shuffle(joined);
    const joinedForMessage = joined.map((player) => {
      return prepareUserIdForMessage(player);
    });
    sendSlackMessage(
        "GAME FILLED by " +
            joinedForMessage.join(", ") +
            ". Post result to start new game."
    );
    timeLeft = null;
  } else {
    sendSlackMessage(
        "<@" + playerName + ">" +
            " joined, " + (4 - joined.length) +
            " space(s) left" +
            ", time left: " + timeLeft.getTimeLeft()
    );
  }
};

const startGame = (user) => {
  timeLeft = new Timer(() => stopGame(), 300000);
  getUser(user);
  started = true;
  joined.push(user);
  sendSlackMessage(
      "Game started by " +
        "<@" + user + ">" +
        " time left: " + timeLeft.getTimeLeft()
  );
};

const stopGame = () => {
  started = false;
  joined = [];
  timeLeft = null;
  sendSlackMessage("Timed out.");
};

const handleResult = (text) => {
  if (!joined.length) {
    joined = shuffle([
      "test",
      "test2",
      "test3",
      "test4",
    ]);

    getUser("test");
    getUser("test2");
    getUser("test3");
    getUser("test4");
    started = true;
  }

  const scores = text.split(" ");

  for (const score in scores) {
    if (!Number.isInteger(Number(score))) {
      return "Enter result of match '/result [int] [int]'";
    }
  }

  if (scores.length === 2 && started) {
    submitGame(
        scores,
        joined
    );

    let scoreText = scores[0] + " - " + scores[1] + " :ez::clap_gif:";
    if (Number(scores[0]) > Number(scores[1])) {
      scoreText += prepareUserIdForMessage(joined[0]) +
          " and " + prepareUserIdForMessage(joined[1]);
    } else {
      scoreText += prepareUserIdForMessage(joined[2]) +
          " and " + prepareUserIdForMessage(joined[3]);
    }

    sendSlackMessage(scoreText);
    timeLeft = null;
    joined = [];
    started = false;
  } else {
    return "Enter result of match '/result [int] [int]'";
  }
};

const submitGame = (result, players) => {
  const winningScore = 10;


  // update users
  const teams = [
    {
      players: [
        getUser(players[0]),
        getUser(players[1]),
      ],
      resultValue: Number(result[0]),
    },

    {
      players: [
        getUser(players[2]),
        getUser(players[3]),
      ],
      resultValue: Number(result[1]),
    },
  ];


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
      [players[0], players[1]],
      [players[2], players[3]],
    ],
    result: result[0] + "-" + result[1],
    delta: teams[0].newDeltaRating,
  };

  console.log(users);

  db.ref("users").set(users).then(() => console.log("users saved"));

  db.ref("games").push(game).then(() => console.log("game saved"));
};

const calculateNewRating = (rating, oppRating, result) => {
  const ratio = (oppRating - rating) / 400;
  const expectedScore = 1 / (1 + (Math.pow(10, ratio)));
  return Math.round(rating + (40 * (result - expectedScore)));
};

const getUser = (userId) => {
  if (users && users[userId]) {
    return users[userId];
  } else {
    return createUser(userId);
  }
};

const getAllUsers = () => {
  console.log("getting users");
  if (!started) {
    const ref = db.ref("users");
    ref.once("value")
        .then((snapshot) => {
          if (snapshot.val()) {
            users = snapshot.val();
          }
          return users;
        });
  }
  console.log(users);
};

const syncHandler = () => {
  getAllUsers();
  setInterval(getAllUsers, 60000);
};

const createUser = (userId) => {
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
        .set({[userId]: newPlayer})
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
