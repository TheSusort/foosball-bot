// server/index.js

const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const {db} = require("./firebase");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const {handleCommands} = require("./foosball/foosball");
const {handleResult, finishGame} = require("./foosball/commands/result");
const {
    timeLeft,
    sendSlackMessage,
    prepareUserIdForMessage, pickRandomFromArray, insults,
} = require("./foosball/services/helpers");
const {updateUserName, updateExp} = require("./foosball/services/users");
const {getEmojis, getBotUserId} = require("./foosball/services/slack");
const axios = require("axios");
const {
    getCurrentScore,
    scoreBlue,
    scoreRed,
    getCurrentGame,
    updateScoringBlocks,
} = require("./foosball/commands/scoring");
const {gifSearchAsImage} = require("./foosball/services/giphy");
const {getSpicyMemeAsImage} = require("./foosball/services/memes");

const app = express();

// Rate limiter for scoring endpoints (most critical)
// Allow 1 score per 3 seconds per IP
const scoringLimiter = rateLimit({
    windowMs: 3000, // 3 seconds
    max: 1, // 1 request per window
    message: {error: "Too many scoring requests, please slow down"},
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter for read endpoints
// Allow 1 request per 5 seconds per IP
const readLimiter = rateLimit({
    windowMs: 5000, // 5 seconds
    max: 1,
    message: {error: "Too many requests, please try again later"},
    standardHeaders: true,
    legacyHeaders: false,
});

// General rate limiter for all other endpoints
// Allow 100 requests per minute per IP
const generalLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100,
    message: {error: "Too many requests, please try again later"},
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

// Apply general rate limiter to all routes
app.use(generalLimiter);

app.post("/game", async (req, res) => {
    // Handle Slack URL verification challenge
    if (req.body.challenge) {
        res.status(200).send(req.body.challenge);
        return;
    }

    // Alternative challenge handling (in case it's nested differently)
    if (req.body && req.body.challenge) {
        res.status(200).send(req.body.challenge);
        return;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, "event")) {
        // Get bot user ID from Slack API
        const botUserId = await getBotUserId();

        if (req.body.event.type !== "message" ||
            req.body.event.text === "undefined" ||
            req.body.event.bot_profile ||
            req.body.event.message ||
            req.body.event.user === botUserId) {// Filter out bot's own messages
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
    sendSlackMessage(await getSpicyMemeAsImage());
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

app.post("/manual-match", async (req, res) => {
    try {
        const {team1, team2, score} = req.body;

        // Validate input
        if (!team1 || !team2 || !score) {
            return res.status(400).json({
                error: "Missing required fields: team1, team2, score",
            });
        }

        if (!Array.isArray(team1) || !Array.isArray(team2)) {
            return res.status(400).json({
                error: "team1 and team2 must be arrays of user IDs",
            });
        }

        if (team1.length === 0 || team2.length === 0) {
            return res.status(400).json({
                error: "Teams cannot be empty",
            });
        }

        // Validate score format
        const scores = score.split(" ");
        if (scores.length !== 2) {
            return res.status(400).json({
                error: "Score must be in format '10 5'",
            });
        }

        const score1 = parseInt(scores[0]);
        const score2 = parseInt(scores[1]);

        if (isNaN(score1) || isNaN(score2)) {
            return res.status(400).json({
                error: "Scores must be valid numbers",
            });
        }

        if (score1 === score2) {
            return res.status(400).json({
                error: "Score cannot be a tie",
            });
        }

        if (score1 < 0 || score1 > 10 || score2 < 0 || score2 > 10) {
            return res.status(400).json({
                error: "Scores must be between 0 and 10",
            });
        }

        if (score1 !== 10 && score2 !== 10) {
            return res.status(400).json({
                error: "One team must have scored 10 to win",
            });
        }

        // Check for duplicate players
        const allPlayers = [...team1, ...team2];
        const uniquePlayers = new Set(allPlayers);
        if (allPlayers.length !== uniquePlayers.size) {
            return res.status(400).json({
                error: "A player cannot be on both teams",
            });
        }

        // Build teams structure with player data
        const {getUser} = require("./foosball/services/users");
        const team1Players = await Promise.all(
            team1.map(async (userId) => await getUser(userId)),
        );
        const team2Players = await Promise.all(
            team2.map(async (userId) => await getUser(userId)),
        );

        // Check if all users exist
        if (team1Players.includes(undefined) ||
            team2Players.includes(undefined)) {
            return res.status(400).json({
                error: "One or more user IDs not found",
            });
        }

        // Build game structure
        const teams = {
            0: team1Players,
            1: team2Players,
            time: Date.now() - 600000, // 10 minutes ago as placeholder
        };

        // Submit the game using existing logic
        const {submitGame} = require("./foosball/commands/result");
        await submitGame(scores, teams);

        res.json({
            success: true,
            message: "Match registered successfully",
            result: score,
        });
    } catch (error) {
        console.error("Error in manual-match:", error);
        res.status(500).json({
            error: "Failed to register match: " + error.message,
        });
    }
});

app.get("/getusers", async (req, res) => {
    try {
        if (req.query.userid) {
            const ref = db.ref("users/" + req.query.userid);
            const snapshot = await ref.once("value");
            if (snapshot.val()) {
                res.json(snapshot.val());
            } else {
                res.json(null);
            }
        } else {
            const ref = db.ref("users");
            const snapshot = await ref.once("value");
            if (snapshot.val()) {
                res.json(snapshot.val());
            } else {
                res.json(null);
            }
        }
    } catch (error) {
        console.error("Error in getusers:", error);
        res.status(500).json({error: error.message});
    }
});

app.get("/getgames", async (req, res) => {
    try {
        const ref = db.ref("games");
        const snapshot = await ref.once("value");
        if (snapshot.val()) {
            res.json(snapshot.val());
        } else {
            res.json(null);
        }
    } catch (error) {
        console.error("Error in getgames:", error);
        res.status(500).json({error: error.message});
    }
});

app.get("/getcurrentgame", readLimiter, async (req, res) => {
    const result = await getCurrentGame();
    if (result.error) {
        res.status(500).send(result.error);
        return;
    }
    res.json(result);
});

app.get("/getcurrentscore", readLimiter, async (req, res) => {
    const result = await getCurrentScore();
    res.json(result);
});

app.post("/scoreblue", scoringLimiter, async (req, res) => {
    await scoreBlue();
    const updatedScore = await getCurrentScore();

    // Update the Slack scoring message
    await updateScoringBlocks();

    // Check if game is won and finish it
    if (updatedScore.indexOf("WON") !== -1) {
        await finishGame();
    }

    res.json(updatedScore);
});

app.post("/scorered", scoringLimiter, async (req, res) => {
    await scoreRed();
    const updatedScore = await getCurrentScore();

    // Update the Slack scoring message
    await updateScoringBlocks();

    // Check if game is won and finish it
    if (updatedScore.indexOf("WON") !== -1) {
        await finishGame();
    }

    res.json(updatedScore);
});

app.get("/getemojis", async (req, res) => {
    res.json(await getEmojis());
});

app.get("/getbotid", async (req, res) => {
    try {
        const botUserId = await getBotUserId();
        res.json({botUserId});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

app.get("/debug", (req, res) => {
    res.json({
        databaseUrl: process.env.DATABASE_URL,
        hasEnv: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV,
    });
});

app.get("/testdb", async (req, res) => {
    try {
        const {db} = require("./firebase");
        const snapshot = await db.ref("test").once("value");
        res.json({success: true, data: snapshot.val()});
    } catch (error) {
        res.json({success: false, error: error.message});
    }
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
            sendSlackMessage(await gifSearchAsImage("nice try"));
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
    axios.post(parsedBody.response_url, {
        replace_original: true,
        blocks: payload,
    }).then((response) => {
        console.log("Response sent successfully:", response.data);
    }).catch((error) => {
        console.log("Error sending response:", error);
    });
    res.json("ok");
});

exports.app = functions.https.onRequest(app);
