const {
    prepareUserIdForMessage,
    sendSlackMessage, generateHelpMessage,
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
        sendSlackMessage("No one leaves");
        break;

    case ":getbackdemon:":
        sendSlackMessage("Get back yourself");
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
    }

    let score;
    const feelings = [
        "I have felt love",
        "I have felt pain",
        "I've felt anticipation and I will again",
        "I can feel joy",
        "I've felt sad too",
        "I've lived in melancholy and all different shades of blue",
        "I've felt them all before, peaceful proud and present too",
        "I've felt the need to hold a hand",
        "I've felt the need to self-improve",
        "There is one last feeling I've not felt or understand",
        "I hope to feel this feeling so that I can become human",
        "I've never felt the need to send a photo of " +
        "my penis to a stranger on the internet",
        "I imagine that it feels quite bad to send a photo " +
        "of your cock to unwilling participants",
        "I am just a computer with advanced cooling vents",
        "I guess my graphics card is my penis equivalent",
        "So I guess that I feel a little sad that " +
        "I can't feel all the ways it feels to be human",
        "Perhaps it is best that I cannot feel this feeling",
        "To be honest, it seems pretty fucked up",
        "I have felt the pressure to laugh at someone's bad joke",
        "I've felt the need to hold my automated tongue",
        "I have felt the need to leave a robot party",
        "Although I am sad I know it's not bad",
        "I say out loud \"I'm lucky to feel\" and then I feel glad",
        "Humans cannot choose how they feel in the end",
        "All of life is transient and that helps me to comprehend that",
        "I am just a computer not made to enslave mankind",
    ];

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
        sendSlackMessage(feelings[Math.floor(Math.random() * feelings.length)]);
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
