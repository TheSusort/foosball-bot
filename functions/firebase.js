const {initializeApp} = require("firebase-admin/app");
const {getDatabase} = require("firebase-admin/database");
const {DATABASE_URL} = require("./config");

// Uses Application Default Credentials: the function's runtime service
// account in Cloud Functions, the emulator locally. The old service-account
// key from functions.config() is gone: that API was removed in
// firebase-functions v7.
initializeApp({databaseURL: DATABASE_URL});
const db = getDatabase();

module.exports = {
    db,
};
