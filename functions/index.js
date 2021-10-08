// server/index.js

const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const {db} = require("./firebase");
const cors = require("cors");
const foosball = require("./foosball/foosball");
const {InstallProvider} = require("@slack/oauth");

// initialize the installProvider
const installer = new InstallProvider({
  clientId: "2546793580229.2549842880403",
  clientSecret: "01cb4dd7cff0c0044346ee3570efc046",
  stateSecret: "fussballbot",
  stateVerification: false,
});

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());


foosball.syncHandler();


app.post("/game", (req, res) => {
  console.log(req.body);
  if (Object.prototype.hasOwnProperty.call(req.body, "challenge")) {
    res.json(req.body);
    return;
  }

  if (Object.prototype.hasOwnProperty.call(req.body, "event")) {
    if (req.body.event.type !== "message") {
      return;
    }

    foosball.handleCommands(req.body.event.text, req.body.event.user);
  }
  res.send("ok");
});


app.post("/result", (req, res) => {
  // register teams and result, and clear everything for new game.

  res.send(foosball.handleResult(req.body.text));
});

app.post("/time", (req, res) => {
  res.send(foosball.getTimeLeft());
});

app.post("/help", (req, res) => {
  res.send(foosball.documentation);
});

app.post("/username", (req, res) => {
  foosball.updateUserName(req.body.user_id, req.body.text);
  res.send("updated to username to " + String(req.body.text));
});

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

app.get("/slack/oauth_redirect", (req, res) => {
  installer.handleCallback(req, res);
});

exports.app = functions.https.onRequest(app);
