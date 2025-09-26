// Import the functions you need from the SDKs you need
const firebase = require("firebase-admin");
const functions = require("firebase-functions");
const {DATABASE_URL} = require("./config");

// Initialize Firebase Admin SDK
const firebaseConfig = {
    databaseURL: DATABASE_URL,
};

// Only add credentials if not in emulator mode
if (process.env.FUNCTIONS_EMULATOR !== "true") {
    try {
        const config = functions.config();
        firebaseConfig.credential = firebase.credential.cert({
            privateKey: config.private.key.replace(/\\n/g, "\n"),
            projectId: config.project.id,
            clientEmail: config.client.email,
        });
    } catch (error) {
        console.warn(
            "Could not load Firebase config, using default credentials:",
            error.message,
        );
    }
}

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

module.exports = {
    db,
    firebase,
};
