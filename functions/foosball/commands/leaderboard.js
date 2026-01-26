const {sendSlackMessage} = require("../services/helpers");
const {getUsers} = require("../services/shared");

const handleLeaderboard = async () => {
    const users = await getUsers();
    const userList = Object.values(users).filter((user) => user.totalGames > 0);

    if (userList.length === 0) {
        sendSlackMessage("No players have played any games yet!");
        return;
    }

    // Sort by rating for ELO leaderboard
    const byRating = [...userList]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);

    // Sort by coins for wallet leaderboard
    const byCoins = [...userList]
        .filter((user) => user.coins !== undefined)
        .sort((a, b) => b.coins - a.coins)
        .slice(0, 5);

    const ratingRows = byRating.map((user, index) => {
        const winRate = user.totalGames > 0 ?
            Math.round((user.wins / user.totalGames) * 100) : 0;
        const medal = index === 0 ? ":first_place_medal:" :
            index === 1 ? ":second_place_medal:" :
                index === 2 ? ":third_place_medal:" : `${index + 1}.`;
        return `${medal} *${user.name}* - ${Math.round(user.rating)} ` +
            `_(${winRate}% win rate)_`;
    }).join("\n");

    const walletRows = byCoins.map((user, index) => {
        const medal = index === 0 ? ":first_place_medal:" :
            index === 1 ? ":second_place_medal:" :
                index === 2 ? ":third_place_medal:" : `${index + 1}.`;
        return `${medal} *${user.name}* - ${user.coins} coins`;
    }).join("\n");

    const blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": ":trophy: Leaderboards :trophy:",
                "emoji": true,
            },
        },
        {
            "type": "divider",
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*:chart_with_upwards_trend: Rating*",
            },
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": ratingRows,
            },
        },
        {
            "type": "divider",
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*:moneybag: Richest Players*",
            },
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": walletRows || "No one has any coins yet!",
            },
        },
    ];

    sendSlackMessage(blocks);
};

module.exports = {
    handleLeaderboard,
};
