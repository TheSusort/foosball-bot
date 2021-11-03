// server/index.js

const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const {db} = require("./firebase");
const cors = require("cors");
const {handleCommands} = require("./foosball/foosball");
const {handleResult, finishGame} = require("./foosball/commands/result");
const {
    timeLeft,
    sendSlackMessage,
    prepareUserIdForMessage, pickRandomFromArray, insults,
} = require("./foosball/services/helpers");
const {updateUserName, updateExp} = require("./foosball/services/users");
const {getEmojis} = require("./foosball/services/slack");
const request = require("request");
const {
    getCurrentScore,
    scoreBlue,
    scoreRed, getCurrentGame,
} = require("./foosball/commands/scoring");
const {gifSearch} = require("./foosball/services/giphy");
const {getSpicyMeme} = require("./foosball/services/memes");

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.post("/game", async (req, res) => {
    if (Object.prototype.hasOwnProperty.call(req.body, "challenge")) {
        res.json(req.body);
        return;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, "event")) {
        if (req.body.event.type !== "message" ||
            req.body.event.text === "undefined" ||
            req.body.event.bot_profile ||
            req.body.event.message) {
            res.send("ok");
            return;
        }
        await handleCommands(req.body.event.text, req.body.event.user);
        await updateExp(req.body.event.user, "channel");
    }

    res.send("ok");
});

app.post("/result", (req, res) => {
    // register teams and result, and clear everything for new game.
    console.log("result request: ", req.body.text);
    handleResult(req.body.text, req.body.user_id).then((r) => res.send(r));
    res.send();
});

app.post("/time", (req, res) => {
    console.log("time request");
    res.send(timeLeft());
});

app.post("/help", async (req, res) => {
    await handleCommands("help", req.body.user_id);
    res.json("ok");
});

app.post("/username", (req, res) => {
    console.log("username request: ", req.body.user_id, req.body.text);
    updateUserName(req.body.user_id, req.body.text).then(
        (r) => res.send("updated to username to " + String(req.body.text)),
    );
});

app.post("/meme", async (req, res) => {
    sendSlackMessage(await getSpicyMeme());
    res.json("ok");
});

app.post("/add", (req, res) => {
    if (req.body.text === "2v1") {
        handleCommands("start", "test");
        handleCommands("join single", "test2");
        handleCommands("join", "test3");
    } else if (req.body.text === "single") {
        handleCommands("start single", "test");
        handleCommands("join single", "test2");
    } else {
        handleCommands("start", "test");
        handleCommands("join", "test2");
        handleCommands("join", "test3");
        handleCommands("join", "test4");
    }

    handleResult("10 0");
    res.json("ok");
});

app.get("/getusers", (req, res) => {
    if (req.query.userid) {
        try {
            const ref = db.ref("users/" + req.query.userid);
            ref.once("value")
                .then((snapshot) => {
                    if (snapshot.val()) {
                        res.json(snapshot.val());
                    }
                });
        } catch (error) {
            res.status(500).send(error);
        }
    } else {
        try {
            const ref = db.ref("users");
            ref.once("value")
                .then((snapshot) => {
                    if (snapshot.val()) {
                        res.json(snapshot.val());
                    }
                });
        } catch (error) {
            res.status(500).send(error);
        }
    }
});

app.get("/getgames", (req, res) => {
    try {
        const ref = db.ref("games");
        ref.once("value")
            .then((snapshot) => {
                if (snapshot.val()) {
                    res.json(snapshot.val());
                }
            });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get("/getcurrentgame", async (req, res) => {
    const result = await getCurrentGame();
    if (result.error) {
        res.status(500).send(result.error);
        return;
    }
    res.json(result);
});

app.get("/getcurrentscore", async (req, res) => {
    const result = await getCurrentScore();
    res.json(result);
});

app.post("/scoreblue", (req, res) => {
    res.json(scoreBlue());
});

app.post("/scorered", (req, res) => {
    res.json(scoreRed());
});

app.get("/getemojis", async (req, res) => {
    res.json(await getEmojis());
});

app.post("/interactivity", async (req, res) => {
    const parsedBody = JSON.parse(req.body.payload);
    const payload = parsedBody.message.blocks;

    console.log("interactivity ", parsedBody.user.id);
    const currentGame = await getCurrentGame();
    let updatedScore;
    let buttonsIndex;

    if (!currentGame || currentGame.error) {
        buttonsIndex = payload.findIndex((block) => block.type === "actions");
        if (buttonsIndex !== -1 && (
            parsedBody.actions[0].action_id === "actionId-0" ||
            parsedBody.actions[0].action_id === "actionId-1")
        ) {
            console.log("remove buttons");
            payload.splice(buttonsIndex, 1);
            sendSlackMessage(
                prepareUserIdForMessage(
                    parsedBody.user.id) + " nice try, " +
                pickRandomFromArray(insults),
            );
            sendSlackMessage(await gifSearch("nice try"));
        }
    } else {
        if (parsedBody.actions[0].action_id === "actionId-0") {
            updatedScore = await scoreBlue().then(() => getCurrentScore());
        } else if (parsedBody.actions[0].action_id === "actionId-1") {
            updatedScore = await scoreRed().then(() => getCurrentScore());
        } else {
            res.json("ok");
            return;
        }

        if (updatedScore.indexOf("WON") !== -1) {
            buttonsIndex = payload.findIndex(
                (block) => block.type === "actions",
            );
            if (buttonsIndex !== -1) {
                console.log("remove buttons");
                payload.splice(buttonsIndex, 1);
            }
            await finishGame();
        }
        const scoreIndex = payload.findIndex(
            (block) => block.type === "header",
        );
        payload[scoreIndex].text.text = updatedScore;
    }
    request({
        uri: parsedBody.response_url,
        method: "POST",
        body: JSON.stringify({
            replace_original: true,
            blocks: payload,
        }),
    }, (error, response) => {
        console.log(error, response.body);
    });
    res.json("ok");
});

exports.app = functions.https.onRequest(app);
