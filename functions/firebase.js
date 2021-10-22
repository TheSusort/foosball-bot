// Import the functions you need from the SDKs you need
const firebase = require("firebase-admin");
const functions = require("firebase-functions");
const {FIREBASE_DB_URL} = require("./config");

firebase.initializeApp({
    credential: firebase.credential.cert({
        privateKey: functions.config().private.key.replace(/\\n/g, "\n"),
        projectId: functions.config().project.id,
        clientEmail: functions.config().client.email,
    },
    ),
    databaseURL: FIREBASE_DB_URL,
});
const db = firebase.database();

module.exports = {
    db,
    firebase,
};
