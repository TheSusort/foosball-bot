const {db} = require("../../firebase");
const {getUsers, setUsers} = require("./shared");

/**
 * gets user
 * @param {string} userId
 * @return {Promise<DataSnapshot|*>}
 */
const getUser = async (userId) => {
    const users = await getUsers();
    // console.log(users);
    // console.log(userId + ": " + users[userId]);
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
    await getUsers().then(async (users) => {
        console.log("users from updateuser: ", users);
        if (!users[userId]) {
            userId = await createUser(userId);
        }
        users[userId].wins += win;
        users[userId].rating = newRating;
        users[userId].totalGames++;
        setUsers(users);
    });
};

/**
 * Update username
 * @param {string} userId
 * @param {string} newUserName
 */
const updateUserName = async (userId, newUserName) => {
    const users = await getUsers();
    if (users[userId]) {
        return await db.ref("users")
            .child(userId).update({"name": String(newUserName)}).then(
                () => "updated to username to " + String(newUserName),
            );
    }
};

module.exports = {
    getUser,
    createUser,
    updateUser,
    updateUserName,
};
