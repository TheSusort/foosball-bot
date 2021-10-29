const {
    prepareUserIdForMessage,
    sendSlackMessage,
    generateHelpMessage,
    feelings,
    pickRandomFromArray,
    jokes,
    insults, zingers,
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
const {getSpicyMeme} = require("./services/memes");

const handleCommands = async (text, user) => {
    let score;
    let feeling;
    // eslint-disable-next-line max-len
    const botRegex = new RegExp(/.*ai|sentient|personlighet|intelligence|iq|bot|mind|human|kill|feel|følelse.*/i);

    switch (true) {
    case /^start$/i.test(text):
        await handleStart(user, false);
        break;

    case /^start single$/i.test(text):
        await handleStart(user, true);
        break;

    case /^force start$/i.test(text):
        await handleForceStart();
        break;

    case /^join$/i.test(text):
        await handleJoin(user, false);
        break;
    case /^j o i n$/i.test(text):
        sendSlackMessage(await gifSearch("nice try"));
        await handleJoin(user, false);
        break;

    case /^join single$/i.test(text):
        await handleJoin(user, true);
        break;

    case /^help/i.test(text):
        sendSlackMessage(
            "<@" + user + "> requested help :lulw: \n",
        );
        generateHelpMessage();
        break;

    case /^user$/i.test(text):
        getUser(user).then((currentUser) => {
            sendSlackMessage(
                prepareUserIdForMessage(user) +
                    " is going by the username " +
                    currentUser.name,
            );
        });
        break;

    case /^timeleft$/i.test(text):
        sendSlackMessage(timeLeft());
        break;

    case /^leave$/i.test(text):
        sendSlackMessage("No one leaves, " + pickRandomFromArray(insults));
        break;

    case /^:getbackdemon:/i.test(text):
        sendSlackMessage("Get back yourself, " + pickRandomFromArray(insults));
        break;

    case /^stop$/i.test(text):
        stopGame(true);
        break;

    case /^status$/i.test(text):
        await handleStatus();
        break;

    case /^test scoring$/i.test(text):
        await buildScoringBlocks();
        break;

    case /^gif/i.test(text):
        sendSlackMessage(await gifSearch("robot"));
        break;
    case /.*spicy meme.*/i.test(text):
        console.log("meme");
        sendSlackMessage(await getSpicyMeme());
        break;

    case /^test.*/.test(text):
        console.log(text);
        score = text.split("test ")[1];
        if (score && parseInt(score[0] && score[1] && score[2])) {
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

    case /.*rekt.*/.test(text):
        sendSlackMessage(pickRandomFromArray(jokes));
        sendSlackMessage(
            pickRandomFromArray(zingers) + prepareUserIdForMessage(user),
        );
        break;

    case botRegex.test(text):
        feeling = pickRandomFromArray(feelings);
        sendSlackMessage(feeling);
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
    let finished = false;
    db.ref("current_score").on("child_changed", (r) => {
        console.log("SCORE");
        if (r.val()) {
            console.log(
                r.val() + " for team " + (Number(r.key) ? "red" : "blue"),
            );
            if (r.val() === 10 && !finished) {
                finished = true;
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
