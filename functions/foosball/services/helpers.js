const {sendSlackMessageViaAPI} = require("./slack");
let time;

/* eslint-disable max-len */
const documentation =

    "```" +
    "**Fussball bot commands** \n" +
    "------------------------------------------------------------------------------\n" +
    "   start                     start game \n" +
    "   start single              start game as single\n" +
    "   join                      join game \n" +
    "   join single               join game as single \n" +
    "   /result [int] [int]       end game and log result \n" +
    "   /time                     timers have been disabled \n" +
    "   help|/help                show commands \n" +
    "   /username [string]        set new username \n" +
    "   /add 2v1|single|[]        test command for testing modes \n" +
    "   force start               experimental feature to start game with currently\n" +
    "                             joined players \n" +
    "   stop                      force stops the game \n" +
    "   status                    gets current status \n" +
    "   test [int] [int] [bool]   test rating system. input your score, opponents \n" +
    "                             score and win(true/false)" +
    "```"

;
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

module.exports = {
    documentation,
    shuffle,
    prepareUserIdForMessage,
    sendSlackMessage,
    Timer,
    timeLeft,
    escapeHtml,
};
