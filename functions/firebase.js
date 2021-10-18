// Import the functions you need from the SDKs you need
const firebase = require("firebase-admin");
const functions = require("firebase-functions");

firebase.initializeApp({
    credential: firebase.credential.cert({
        privateKey: functions.config().private.key.replace(/\\n/g, "\n"),
        projectId: functions.config().project.id,
        clientEmail: functions.config().client.email,
    },
    ),
    databaseURL: "https://foosball-bot-1b613-default-rtdb.europe-west1.firebasedatabase.app",
});
const db = firebase.database();

module.exports = {
    db,
};
