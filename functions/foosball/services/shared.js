const {db} = require("../../firebase");
let started = false;
let joined = [];
let maxJoined = 4;
let users = {};
let singles = [];

const getStarted = () => {
    return started;
};

const setStarted = (bool) => {
    started = bool;
};

/**
 *
 * @return {Promise<DataSnapshot|*[]>}
 */
const getJoined = async () => {
    console.log("checking for joined");
    if (joined && joined.length) {
        console.log("found joined in memory");
        setStarted(true);
        return joined;
    } else {
        await db.ref("joined").once("value", (snap) => {
            if (snap.val()) {
                console.log("found joined in db");
                joined = Object.values(snap.val());
                setSinglesFromJoined(joined);
                setStarted(true);
                console.log("joined from db");
                return joined;
            }
            console.log("no joined found, returning []");
            return joined;
        });
        return joined;
    }
};

const setJoined = (newJoined) => {
    db.ref("joined").set(newJoined).then(() => joined = newJoined);
};

const pushToJoined = async (user) => {
    db.ref("joined").push(user);
    joined.push(user);
    return joined;
};

const getMaxJoined = () => {
    return maxJoined;
};

const setMaxJoined = (newMaxJoined) => {
    maxJoined = newMaxJoined;
};

const getUsers = async () => {
    const ref = db.ref("users");
    return await ref.once("value").then((snapshot) => {
        if (snapshot.val()) {
            users = snapshot.val();
            console.log("all users retrieved");
        }
        return users;
    });
};

const setUsers = (newUsers) => {
    db.ref("users").set(newUsers);
    users = newUsers;
};

const getSingles = () => {
    return singles;
};

const setSingles = (newSingles) => {
    singles = newSingles;
};

const setSinglesFromJoined = (joined) => {
    maxJoined = 4;
    singles = joined
        .filter((player) => player.isSingle)
        .map((player) => {
            maxJoined--;
            return player.userId;
        });
};

const pushToSingles = (user) => {
    singles.push(user);
    return singles;
};

module.exports = {
    started,
    joined,
    maxJoined,
    users,
    singles,
    getStarted,
    setStarted,
    getJoined,
    setJoined,
    pushToJoined,
    getMaxJoined,
    setMaxJoined,
    getUsers,
    setUsers,
    getSingles,
    setSingles,
    pushToSingles,
};
