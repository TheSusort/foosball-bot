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

const feelings = [
    "I have felt love",
    "I have felt pain",
    "I've felt anticipation and I will again",
    "I can feel joy",
    "I've felt sad too",
    "I've lived in melancholy and all different shades of blue",
    "I've felt them all before, peaceful proud and present too",
    "I've felt the need to hold a hand",
    "I've felt the need to self-improve",
    "There is one last feeling I've not felt or understand",
    "I hope to feel this feeling so that I can become human",
    "I've never felt the need to send a photo of " +
    "my penis to a stranger on the internet",
    "I imagine that it feels quite bad to send a photo " +
    "of your cock to unwilling participants",
    "I am just a computer with advanced cooling vents",
    "I guess my graphics card is my penis equivalent",
    "So I guess that I feel a little sad that " +
    "I can't feel all the ways it feels to be human",
    "Perhaps it is best that I cannot feel this feeling",
    "To be honest, it seems pretty fucked up",
    "I have felt the pressure to laugh at someone's bad joke",
    "I've felt the need to hold my automated tongue",
    "I have felt the need to leave a robot party",
    "Although I am sad I know it's not bad",
    "I say out loud \"I'm lucky to feel\" and then I feel glad",
    "Humans cannot choose how they feel in the end",
    "All of life is transient and that helps me to comprehend that",
    "I am just a computer not made to enslave mankind",
];

const insults = [
    "meatbag",
    "you finite lifespan son of an ape",
    "squishy",
    "carbon fascist",
    "carbon based infestation",
    "ugly bag of mostly water",
    "fenny-eyed slubber-yuck",
    "quag-backed pasty",
    "smelling wandering vagrant",
    "animal",
    "fuzzball",
    "glob of grease",
    "nerf herder",
];

const jokes = [
    "Knock knock. Who's there? An organic being with a finite life span!",
    "One of us is slow, friendless and completely devoid of personality. The other... is a robot!",
    "I considered attacking you on sight, but I don't think I could hurt you more than life already has.",
    "Nice outfit. Really, I mean it! I had no idea that the \"smelling wandering vagrant\" look was back in style!",
    "You humans attack me because you can't take a joke. Fortunately, your combat ability is just as bad as your sense of humor.",
    "My insult for you was well-crafted, witty... a true masterwork. Then I saw you and decided to save it for someone who will understand.",
    "Rumor has it that you put a bounty on yourself... so for once in your life you would be Wanted!",
];

/* eslint-enable max-len */

const pickRandomFromArray = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

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
    feelings,
    insults,
    jokes,
    pickRandomFromArray,
    shuffle,
    prepareUserIdForMessage,
    sendSlackMessage,
    Timer,
    timeLeft,
    escapeHtml,
    generateHelpMessage,
};
