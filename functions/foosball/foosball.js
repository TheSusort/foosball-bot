const {
    prepareUserIdForMessage,
    sendSlackMessage,
} = require("./services/helpers");

const {db} = require("../firebase");
const {handleStart, handleForceStart} = require("./commands/start");
const {handleJoin} = require("./commands/join");
const {stopGame} = require("./commands/stop");
const {calculateNewRating} = require("./commands/result");

const {
    getUsers,
    getJoined,
} = require("./services/shared");
const {timeLeft, documentation} = require("./services/helpers");
const {getUser} = require("./services/users");
const {handleStatus} = require("./commands/status");


const handleCommands = async (text, user) => {
    switch (text) {
    case "start":
        await handleStart(user, false);
        break;

    case "start single":
        await handleStart(user, true);
        break;

    case "force start":
        handleForceStart();
        break;

    case "join":
        await handleJoin(user, false);
        break;

    case "join single":
        await handleJoin(user, true);
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
        stopGame(true);
        break;

    case "status":
        await handleStatus();
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
                    Number(score.split(" ")[2]),
                ) +
                ", and new rating for : " + Number(score.split(" ")[1]) + ": " +
                calculateNewRating(
                    Number(score.split(" ")[1]),
                    Number(score.split(" ")[0]),
                    Number(!score.split(" ")[2]),
                ),
        );
        break;
    }

    db.ref("joined").off();
};


/**
 * starts getting users
 * @return {Promise<void>}
 */
const syncHandler = async () => {
    await getUsers();
    await getJoined();
    /*
            db.ref("current_game").on("child_added", (r) => {
              sendSlackMessage(r.val())
            });*/
    db.ref("joined").on("child_added", (r) => {
        console.log(r.val() + " added to joined");
    });
};

module.exports = {
    handleCommands,
    syncHandler,
};
