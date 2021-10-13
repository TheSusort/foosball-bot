// server/index.js

const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const {db} = require("./firebase");
const cors = require("cors");
const foosball = require("./foosball/foosball");
const {shuffle} = require("./foosball/helpers");

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());


foosball.syncHandler();


app.post("/game", (req, res) => {
  if (Object.prototype.hasOwnProperty.call(req.body, "challenge")) {
    res.json(req.body);
    return;
  }
  if (Object.prototype.hasOwnProperty.call(req.body, "event")) {
    if (req.body.event.type !== "message") {
      return;
    }
    console.log("game request: ", req.body.event.text);
    foosball.handleCommands(req.body.event.text, req.body.event.user);
  }
  res.send("ok");
});


app.post("/result", (req, res) => {
  // register teams and result, and clear everything for new game.
  console.log("result request: ", req.body.text);
  res.send(foosball.handleResult(req.body.text));
});

app.post("/time", (req, res) => {
  console.log("time request");
  res.send(foosball.getTimeLeft());
});

app.post("/help", (req, res) => {
  console.log("help request");
  res.send(foosball.documentation);
});

app.post("/username", (req, res) => {
  console.log("username request: ", req.body.user_id, req.body.text);
  foosball.updateUserName(req.body.user_id, req.body.text);
  res.send("updated to username to " + String(req.body.text));
});

app.post("/add", async (req, res) => {
  if (req.body.text === "2v1") {
    await foosball.handleCommands("start", "test")
    await foosball.handleCommands("join single", "test2")
    await foosball.handleCommands("join", "test3")

  } else if (req.body.text === "single") {
    await foosball.handleCommands("start single", "test")
    await foosball.handleCommands("join single", "test2")
  } else {
    await foosball.handleCommands("start", "test")
    await foosball.handleCommands("join", "test2")
    await foosball.handleCommands("join", "test3")
    await foosball.handleCommands("join", "test4")
  }

  await foosball.handleResult("10 0")
  res.json("ok")
})

app.get("/getusers", (req, res) => {
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

exports.app = functions.https.onRequest(app);
