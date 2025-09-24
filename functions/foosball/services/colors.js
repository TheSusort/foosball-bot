/**
 * Team color configuration helper
 * Reads team colors from environment variables with fallbacks
 */

const getTeamColors = () => {
    return {
        team1: {
            color: process.env.TEAM_1_COLOR || "blue",
            emoji: process.env.TEAM_1_EMOJI || ":large_blue_circle:",
            name: process.env.TEAM_1_NAME || "Blues",
            slackColor: process.env.TEAM_1_SLACK_COLOR || "primary",
        },
        team2: {
            color: process.env.TEAM_2_COLOR || "red",
            emoji: process.env.TEAM_2_EMOJI || ":red_circle:",
            name: process.env.TEAM_2_NAME || "Reds",
            slackColor: process.env.TEAM_2_SLACK_COLOR || "danger",
        },
    };
};

module.exports = {
    getTeamColors,
};
