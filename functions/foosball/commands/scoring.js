const {db} = require("../../firebase");
const {sendSlackMessage} = require("../services/helpers");
const {CLIENT_URL} = require("../../config");
const {getTeamColors} = require("../services/colors");

/**
 *
 * @return {Promise<void>}
 */
const buildScoringBlocks = async () => {
    const currentScore = await getCurrentScore();
    const colors = getTeamColors();

    const scoringBlocks = [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*CURRENT GAME*",
            },
        },
        {
            "type": "divider",
        },
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": currentScore,
                "emoji": true,
            },
        },

        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "Click the buttons below to " +
                    "register scores in realtime.",
            },
            "accessory": {
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "text": "Realtime View",
                    "emoji": true,
                },
                "value": "click_me_123",
                "url": CLIENT_URL + "/current-match",
                "action_id": "button-action",
            },
        },

        {
            "type": "divider",
        },
        {
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": `Score ${colors.team1.name}`,
                        "emoji": true,
                    },
                    "value": "score_blue",
                    "action_id": "actionId-0",
                    "style": colors.team1.slackColor,
                },
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": `Score ${colors.team2.name}`,
                        "emoji": true,
                    },
                    "value": "score_red",
                    "action_id": "actionId-1",
                    "style": colors.team2.slackColor,
                },
            ],
        },
    ];

    sendSlackMessage(scoringBlocks);
};

/**
 *
 * @return {Promise<string>}
 */
const scoreBlue = async () => {
    // Get current score and increment manually
    const scoreRef = db.ref("current_score/0");
    const snapshot = await scoreRef.once("value");
    const currentScore = snapshot.val() || 0;

    const updates = {
        "current_score/0": currentScore + 1,
    };
    return await db.ref().update(updates).then((r) => {
        console.log(r);
        return "go blue";
    });
};

/**
 *
 * @return {Promise<string>}
 */
const scoreRed = async () => {
    // Get current score and increment manually
    const scoreRef = db.ref("current_score/1");
    const snapshot = await scoreRef.once("value");
    const currentScore = snapshot.val() || 0;

    const updates = {
        "current_score/1": currentScore + 1,
    };
    return await db.ref().update(updates).then(() => {
        return "Go red";
    });
};

/**
 *
 * @return {Promise<array|string>}
 */
const getCurrentScore = async () => {
    try {
        const ref = db.ref("current_score");
        return await ref.once("value")
            .then((snapshot) => {
                if (snapshot.val()) {
                    if (snapshot.val()[0] >= 10) {
                        return "BLUE TEAM WON \n" +
                            snapshot.val().join(" - ");
                    } else if (snapshot.val()[1] >= 10) {
                        return "RED TEAM WON \n" +
                            snapshot.val().join(" - ");
                    }
                    return snapshot.val().join(" - ");
                } else {
                    return "0 - 0";
                }
            });
    } catch (error) {
        return error;
    }
};

const getCurrentGame = async () => {
    try {
        const ref = db.ref("current_game");
        return await ref.once("value")
            .then((snapshot) => {
                if (snapshot.val()) {
                    return snapshot.val();
                }
            });
    } catch (error) {
        return {status: 500, error: error};
    }
};

module.exports = {
    buildScoringBlocks,
    scoreBlue,
    scoreRed,
    getCurrentScore,
    getCurrentGame,
};
