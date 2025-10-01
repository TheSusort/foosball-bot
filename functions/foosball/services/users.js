const {db} = require("../../firebase");
const {getUsers, setUsers} = require("./shared");
const {escapeHtml} = require("./helpers");
const {getUserProfile} = require("./slack");

/**
 * Determine the best username from Slack profile data
 * @param {string} userId
 * @param {object} profile
 * @return {string}
 */
const determineUsername = (userId, profile) => {
    let username = "player" + userId; // final fallback

    if (profile) {
        if (profile.first_name && profile.first_name.trim()) {
            username = profile.first_name.trim();
        } else if (profile.real_name && profile.real_name.trim()) {
            username = profile.real_name.trim().split(" ")[0];
        }
    }

    return username;
};

/**
 * gets user
 * @param {string} userId
 * @return {Promise<DataSnapshot|*>}
 */
const getUser = async (userId) => {
    const users = await getUsers();

    if (users && users[userId]) {
        return users[userId];
    } else {
        try {
            const userFromDb = await db.ref("users/" + userId).once("value")
                .then((snapshot) => {
                    console.log(userId + " from DB: " + snapshot.val());
                    return snapshot.val();
                });

            if (userFromDb) {
                return userFromDb;
            } else {
                return await createUser(userId);
            }
        } catch (e) {
            console.error(e);
        }
    }
};


/**
 * create user
 * @param {string} userId
 * @return {Promise<*>}
 */
const createUser = async (userId) => {
    const users = await getUsers();
    if (!users[userId]) {
        // Get user profile from Slack
        const profile = await getUserProfile(userId);

        // Determine username with fallback hierarchy
        const username = determineUsername(userId, profile);

        const newPlayer = {
            userId: userId,
            name: escapeHtml(username),
            wins: 0,
            totalGames: 0,
            rating: 1000,
            coins: 1000,
        };
        users[userId] = newPlayer;
        db.ref("users")
            .update({[userId]: newPlayer})
            .then(() => console.log(
                userId + " saved with username: " + username,
            ));
    }
    return users[userId];
};

/**
 * Update user
 * @param {string} userId
 * @param {number} win
 * @param {number} newRating
 */
const updateUser = async (userId, win, newRating) => {
    const users = await getUsers();
    console.log("update user");
    if (!users[userId]) {
        console.log("create user");
        userId = await createUser(userId);
    }
    users[userId].wins += win;
    users[userId].rating = newRating;
    users[userId].totalGames++;
    setUsers(users);
    return "ok";
};

/**
 * Update username
 * @param {string} userId
 * @param {string} newUserName
 */
const updateUserName = async (userId, newUserName) => {
    const users = await getUsers();
    let user;
    if (users[userId]) {
        user = users[userId];
    } else {
        user = await getUser(userId);
    }

    user.name = escapeHtml(newUserName);
    users[userId] = user;
    setUsers(users);
};

const updateExp = async (userId, tag) => {
    await getUser(userId);
    const usersRef = db.ref("users");
    const userRef = usersRef.child(userId);
    const expRef = userRef.child("exp");
    // Get current value and increment manually since
    // ServerValue is not available in admin SDK
    const snapshot = await expRef.once("value");
    const currentExp = snapshot.val() || {};
    const currentValue = currentExp[tag] || 0;

    await expRef.update({
        [tag]: currentValue + 1,
    });
};

module.exports = {
    getUser,
    createUser,
    updateUser,
    updateUserName,
    updateExp,
    determineUsername,
};
