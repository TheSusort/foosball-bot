const {sendSlackMessageViaAPI} = require("./slack");
let time;

/* eslint-disable max-len */
const documentation = [
    {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "*Game related commands*",
        },
    },
    {
        "type": "divider",
    },
    {
        "type": "context",
        "elements": [
            {
                "type": "mrkdwn",
                "text": "*start*",
            },
            {
                "type": "mrkdwn",
                "text": "start a new game",
            },
        ],
    },
    {
        "type": "context",
        "elements": [
            {
                "type": "mrkdwn",
                "text": "*start single*",
            },
            {
                "type": "mrkdwn",
                "text": "start a new game as solo player",
            },
        ],
    },
    {
        "type": "context",
        "elements": [
            {
                "type": "mrkdwn",
                "text": "*join*",
            },
            {
                "type": "mrkdwn",
                "text": "join existing game, or starts a new if none exists",
            },
        ],
    },
    {
        "type": "context",
        "elements": [
            {
                "type": "mrkdwn",
                "text": "*join single*",
            },
            {
                "type": "mrkdwn",
                "text": "join existing game as solo player, or starts a new game as a solo player, if none exists",
            },
        ],
    },
    {
        "type": "context",
        "elements": [
            {
                "type": "mrkdwn",
                "text": "*stop*",
            },
            {
                "type": "mrkdwn",
                "text": "stops game and resets all current games/scores",
            },
        ],
    },
    {
        "type": "context",
        "elements": [
            {
                "type": "mrkdwn",
                "text": "*/result [int] [int]*",
            },
            {
                "type": "mrkdwn",
                "text": "manually report result",
            },
        ],
    },
    {
        "type": "divider",
    },
    {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "*User related commands*",
        },
    },
    {
        "type": "divider",
    },
    {
        "type": "context",
        "elements": [
            {
                "type": "mrkdwn",
                "text": "*user*",
            },
            {
                "type": "mrkdwn",
                "text": "displays currently apllied username mapping",
            },
        ],
    },
    {
        "type": "context",
        "elements": [
            {
                "type": "mrkdwn",
                "text": "*/username [string]*",
            },
            {
                "type": "mrkdwn",
                "text": "sets a new username",
            },
        ],
    },
    {
        "type": "divider",
    },
    {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "*helper commands*",
        },
    },
    {
        "type": "divider",
    },
    {
        "type": "context",
        "elements": [
            {
                "type": "mrkdwn",
                "text": "*help*",
            },
            {
                "type": "mrkdwn",
                "text": "prints this for all to see",
            },
        ],
    },
    {
        "type": "context",
        "elements": [
            {
                "type": "mrkdwn",
                "text": "*status*",
            },
            {
                "type": "mrkdwn",
                "text": "get current status",
            },
        ],
    },
    {
        "type": "divider",
    },
    {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "*Testing and experimental commands*",
        },
    },
    {
        "type": "divider",
    },
    {
        "type": "context",
        "elements": [
            {
                "type": "mrkdwn",
                "text": "*force start*",
            },
            {
                "type": "mrkdwn",
                "text": "forces game start, split current participants if there's 2 or more joined. not tested.",
            },
        ],
    },
    {
        "type": "context",
        "elements": [
            {
                "type": "mrkdwn",
                "text": "*test [int] [int] [bool]*",
            },
            {
                "type": "mrkdwn",
                "text": "Test rating calculations. rating, oppo rating, win/lose",
            },
        ],
    },
    {
        "type": "context",
        "elements": [
            {
                "type": "mrkdwn",
                "text": "*/add 2v1|single|[]*",
            },
            {
                "type": "mrkdwn",
                "text": "start different types of games with test users",
            },
        ],
    },
    {
        "type": "divider",
    },
];
/* eslint-enable max-len */

/**
 * Shuffles an array
 * @param {array} array
 * @return {*}
 */
const shuffle = (array) => {
    let currentIndex = array.length;
    let randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
};

/**
 * wraps userid for slack message
 * @param {string} userId
 * @return {string}
 */
const prepareUserIdForMessage = (userId) => {
    return "<@" + userId + ">";
};

/**
 * sends slack message
 * @param {string|array|object} message
 */
const sendSlackMessage = (message) => {
    console.log("should display message: " + message);
    const shouldPostToSlack = true;
    if (shouldPostToSlack) {
        sendSlackMessageViaAPI(message);
    }
};

/**
 * timer
 * @param {function} callback
 * @param {int} delay
 * @return {Timer}
 * @constructor
 */
function Timer(callback, delay) {
    let id;
    let started;
    let remaining = delay;
    let running;

    this.start = function() {
        running = true;
        started = new Date();
        id = setTimeout(callback, remaining);
    };

    this.pause = function() {
        running = false;
        clearTimeout(id);
        remaining -= new Date() - started;
    };

    this.getTimeLeft = function() {
        if (running) {
            this.pause();
            this.start();
        }
        const date = new Date(remaining);
        return (date.getMinutes() < 10 ? "0" : "") +
            date.getMinutes() + ":" +
            (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
    };

    this.getStateRunning = function() {
        return running;
    };

    this.start();
    return this;
}

/**
 * gets time left of timers
 * @param {?number} number
 * @return {string}
 */
const timeLeft = (number = null) => {
    if (number > 0) {
        // time = new Timer(() => stopGame(), int)
    } else if (number === null) {
        time = null;
    }
    if (time) {
        return "Time left: " + time.getTimeLeft();
    }
    return "No timers running";
};

const escapeHtml = (unsafe) => {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

const generateHelpMessage = () => {
    sendSlackMessage(
        documentation,
    );
};

module.exports = {
    documentation,
    shuffle,
    prepareUserIdForMessage,
    sendSlackMessage,
    Timer,
    timeLeft,
    escapeHtml,
    generateHelpMessage,
};
