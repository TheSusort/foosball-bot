const {
    prepareUserIdForMessage,
    sendSlackMessage, generateHelpMessage, feelings, pickRandomFromArray, jokes, insults,
} = require("./services/helpers");

const {db} = require("../firebase");
const {handleStart, handleForceStart} = require("./commands/start");
const {handleJoin} = require("./commands/join");
const {stopGame} = require("./commands/stop");
const {calculateNewRating, finishGame} = require("./commands/result");
const {handleStatus} = require("./commands/status");

const {
    getUsers,
    getJoined,
} = require("./services/shared");
const {timeLeft} = require("./services/helpers");
const {getUser} = require("./services/users");
const {buildScoringBlocks} = require("./commands/scoring");
const {gifSearch} = require("./services/giphy");


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
            "<@" + user + "> requested help :lulw: \n",
        );
        generateHelpMessage();
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
        sendSlackMessage("No one leaves, " + pickRandomFromArray(insults));
        break;

    case ":getbackdemon:":
        sendSlackMessage("Get back yourself, " + pickRandomFromArray(insults));
        break;

    case "stop":
        stopGame(true);
        break;

    case "status":
        await handleStatus();
        break;

    case "test scoring":
        await buildScoringBlocks();
        break;

    case "gif":
        sendSlackMessage(await gifSearch("robot"));
    }

    let score;

    const responseRegex = new RegExp([
        /.*AI|ai|sentient|personlighet|artificial intelligence.*/,
        /.*iq|robot|mind|humans|kill|feelings|følelser.*/,
    ].map((r) => r.source).join(""));

    switch (true) {
    case /^test.*/.test(text):
        console.log(text);
        score = text.split("test ")[1];
        if (parseInt(score[0] && score[1] && score[2])) {
            sendSlackMessage(
                "new rating for : " + Number(score.split(" ")[0]) + ": " +
                    calculateNewRating(
                        Number(score.split(" ")[0]),
                        Number(score.split(" ")[1]),
                        Number(score.split(" ")[2]),
                    ) +
                    ", and new rating for : " +
                    Number(score.split(" ")[1]) + ": " +
                    calculateNewRating(
                        Number(score.split(" ")[1]),
                        Number(score.split(" ")[0]),
                        Number(!score.split(" ")[2]),
                    ),
            );
        }
        break;

    case responseRegex.test(text):
        sendSlackMessage(pickRandomFromArray(feelings));
        break;

    case /^.insult me.*/.test(text):
        sendSlackMessage(pickRandomFromArray(jokes));
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

    db.ref("current_score").on("child_changed", (r) => {
        console.log("SCORE");
        if (r.val()) {
            console.log(
                r.val() + " for team " + (Number(r.key) ? "red" : "blue"),
            );
            if (r.val() === 10) {
                finishGame();
                db.ref("current_score").off();
            }
        }
    });
};

module.exports = {
    handleCommands,
    syncHandler,
};
