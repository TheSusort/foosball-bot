const crypto = require("crypto");
const {
    SLACK_SIGNING_SECRET,
    MANUAL_MATCH_API_KEY,
} = require("../../config");

// Slack rejects replays older than five minutes; so do we.
const MAX_AGE_SECONDS = 60 * 5;

const safeEqual = (a, b) => {
    const bufA = Buffer.from(String(a));
    const bufB = Buffer.from(String(b));
    return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
};

if (!SLACK_SIGNING_SECRET) {
    console.warn(
        "SLACK_SIGNING_SECRET is not set: Slack request signatures are " +
        "NOT verified. Anyone can call the Slack endpoints.",
    );
}

/**
 * Express middleware that checks Slack's request signature.
 * https://api.slack.com/authentication/verifying-requests-from-slack
 * Enforced only when SLACK_SIGNING_SECRET is configured.
 * @param {object} req Express request (Cloud Functions sets req.rawBody)
 * @param {object} res Express response
 * @param {function} next Next middleware
 * @return {void}
 */
const verifySlackRequest = (req, res, next) => {
    if (!SLACK_SIGNING_SECRET) {
        next();
        return;
    }

    const timestamp = req.get("x-slack-request-timestamp");
    const signature = req.get("x-slack-signature");
    if (!timestamp || !signature || !req.rawBody) {
        res.status(401).send("Unauthorized");
        return;
    }

    const age = Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp));
    if (!Number.isFinite(age) || age > MAX_AGE_SECONDS) {
        res.status(401).send("Unauthorized");
        return;
    }

    const base = `v0:${timestamp}:${req.rawBody.toString("utf8")}`;
    const expected = "v0=" + crypto
        .createHmac("sha256", SLACK_SIGNING_SECRET)
        .update(base)
        .digest("hex");

    if (!safeEqual(signature, expected)) {
        res.status(401).send("Unauthorized");
        return;
    }
    next();
};

/**
 * Express middleware for /manual-match. When MANUAL_MATCH_API_KEY is set,
 * callers must send it in the "x-api-key" header.
 * @param {object} req Express request
 * @param {object} res Express response
 * @param {function} next Next middleware
 * @return {void}
 */
const requireManualMatchKey = (req, res, next) => {
    if (!MANUAL_MATCH_API_KEY) {
        next();
        return;
    }
    if (!safeEqual(req.get("x-api-key") || "", MANUAL_MATCH_API_KEY)) {
        res.status(401).json({error: "Unauthorized"});
        return;
    }
    next();
};

/**
 * Only Slack's own response URLs may receive interactivity replies.
 * @param {string} url Value of response_url from the payload
 * @return {boolean}
 */
const isSlackResponseUrl = (url) => {
    try {
        const parsed = new URL(url);
        return parsed.protocol === "https:" &&
            parsed.hostname === "hooks.slack.com";
    } catch (e) {
        return false;
    }
};

module.exports = {
    verifySlackRequest,
    requireManualMatchKey,
    isSlackResponseUrl,
};
