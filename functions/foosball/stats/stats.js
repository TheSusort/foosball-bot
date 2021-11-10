const {getAllGames} = require("../services/shared");
const getSoloWinChance = async () => {
    const games = Object.values(await getAllGames());
    let soloWins = 0;
    let soloGames = 0;
    games.map((game) => {
        const soloGame = game.teams[0].length !== game.teams[1].length;

        game.teams.map((team, index) => {
            if (soloGame && team.length === 1) {
                soloGames++;
                if ((index && game.delta < 0) || (!index && game.delta > 0)) {
                    // win
                    soloWins++;
                }
            }
        });
    });

    return soloWins / soloGames;
};

const getBlueWinChance = async () => {
    const games = Object.values(await getAllGames());
    const coloring = {
        "blue": 0,
        "red": 0,
    };

    for (const game of games) {
        if (game.delta > 0) {
            coloring.blue++;
        } else {
            coloring.red++;
        }
    }
    console.log(coloring.blue / games.length);
    return coloring.blue / games.length;
};

module.exports = {
    getSoloWinChance,
    getBlueWinChance,
};
