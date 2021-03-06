const {db, firebase} = require("../../firebase");
const {getUsers, setUsers} = require("./shared");
const {escapeHtml} = require("./helpers");

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
        const newPlayer = {
            userId: userId,
            name: "player" + userId,
            wins: 0,
            totalGames: 0,
            rating: 1000,
            coins: 1000,
        };
        users[userId] = newPlayer;
        db.ref("users")
            .update({[userId]: newPlayer})
            .then(() => console.log(userId + " saved"));
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
    await expRef.update({
        [tag]: firebase.database.ServerValue.increment(1),
    });
};

module.exports = {
    getUser,
    createUser,
    updateUser,
    updateUserName,
    updateExp,
};
