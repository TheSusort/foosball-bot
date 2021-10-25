const {firebase, db} = require("../../firebase");
const {sendSlackMessage} = require("../services/helpers");

/**
 *
 * @return {Promise<void>}
 */
const buildScoringBlocks = async () => {
    const currentScore = await getCurrentScore();

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
                "url": "https://xn--slckball3000-7cb.no/current-match",
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
                        "text": "Score Blue",
                        "emoji": true,
                    },
                    "value": "score_blue",
                    "action_id": "actionId-0",
                    "style": "primary",
                },
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Score Red",
                        "emoji": true,
                    },
                    "value": "score_red",
                    "action_id": "actionId-1",
                    "style": "danger",
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
    const updates = {
        "current_score/0": firebase.database.ServerValue.increment(1),
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
    const updates = {
        "current_score/1": firebase.database.ServerValue.increment(1),
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

module.exports = {
    buildScoringBlocks,
    scoreBlue,
    scoreRed,
    getCurrentScore,
};
