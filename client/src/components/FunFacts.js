import React from "react";
import {FireIcon, LightningBoltIcon, MoonIcon, ScaleIcon, SparklesIcon} from "@heroicons/react/outline";
import UserName from "./UserName";

const FunFacts = ({users, games}) => {

    let extendedUsers = {}
    for (const user in users) {
        extendedUsers[user] = {
            name: users[user].name,
            totalGames: users[user].totalGames,
            rivals: {},
            teamMates: {}
        }
    }

    const generateFunFact = () => {
        const factType = ["most", "least", "rival", "dreamteam", "coloring"]
        let funFact;
        switch (factType[Math.floor(Math.random() * factType.length)]) {
            // most games
            case "most":
                funFact = getMostPlayedPlayer(users)
                break;

            case "least":
                funFact = getLeastPlayedPlayer(users)
                break;

            case "rival":
                // rivals
                funFact = getRivals()
                break;

            case "dreamteam":
                // dream team
                funFact = getDreamTeams()
                break;

            case "coloring":
                funFact = getColoring()
                break;

            default:
                funFact = "no fun facts found"
                break
        }

        return funFact
    }

    const getMostPlayedPlayer = (users) => {
        const mostGamesPlayed = Object.values(users).sort((a, b) => a.totalGames - b.totalGames).pop()
        return (
            <>
                <div
                    className={"flex items-center rounded bg-gradient-to-r from-purple-600 via-violet-900 to-purple-700 mr-2 text-white p-2 shine"}>
                    <SparklesIcon className={"h-5 w-5 mr-1"}/>
                    {"Tryhard"}
                </div>
                <span>
                    {mostGamesPlayed.name + " has played a total of " + mostGamesPlayed.totalGames + " matches."}
                </span>
            </>
        )
    }

    function getLeastPlayedPlayer(users) {
        const leastGamesPlayed = Object.values(users).sort((a, b) => b.totalGames - a.totalGames).pop()
        return (
            <>
                <div
                    className={"flex items-center rounded bg-gradient-to-r from-green-300 to-green-600 mr-2 text-white p-2 shine"}>
                    <MoonIcon className={"h-5 w-5 mr-1"}/>
                    {"Casual"}
                </div>
                <span>
                    {leastGamesPlayed.name + " has played a total of " + leastGamesPlayed.totalGames + " matches."}
                </span>
            </>
        )
    }

    const getRivals = () => {

        // loop through all players on games
        for (const game of Object.values(games)) {
            for (const team0player of game.teams[0]) {
                for (const team1player of game.teams[1]) {

                    // extendedUsers
                    if (!extendedUsers[team1player].rivals[team0player]) {
                        extendedUsers[team1player].rivals[team0player] = {matches: 0, result: 0}

                    }
                    if (!extendedUsers[team0player].rivals[team1player]) {
                        extendedUsers[team0player].rivals[team1player] = {matches: 0, result: 0}
                    }

                    extendedUsers[team1player].rivals[team0player].matches++
                    extendedUsers[team0player].rivals[team1player].matches++
                    if (game.delta > 0) {
                        extendedUsers[team0player].rivals[team1player].result++
                    } else {
                        extendedUsers[team1player].rivals[team0player].result++
                    }
                }
            }
        }

        const {randomPlayer, randomInteractedPlayerKey, randomInteractedPlayer} = pickRandomObject("rivals")

        let result = [(
            <span key={"startrivals"}>
                <UserName user={randomPlayer}/>
                {" has gone toe to toe with "}
                <UserName user={extendedUsers[randomInteractedPlayerKey]}/>
                {" " + randomPlayer.rivals[randomInteractedPlayerKey].matches + " times, and has "}
            </span>
        )]

        if (randomInteractedPlayer.matches) {
            const winPercent = Math.round((randomInteractedPlayer.result / randomInteractedPlayer.matches) * 100)
            if (winPercent) {
                result.push(<span key={"winraterivals"}>{"a " + winPercent + "% winrate."}</span>)
            } else if (winPercent === 100) {
                result.push(<span key={"lostrivals"}>{" never lost!"}</span>)
            } else {
                result.push(<span key={"wonrivals"}>{" never won!"}</span>)
            }
        }

        return (
            <>
                <div
                    className={"flex items-center rounded bg-gradient-to-r from-gray-600 via-gray-900 to-black mr-2 text-white p-2 shine min-w-min"}
                >
                    <FireIcon className={"h-5 w-5 mr-1 min-w-min"}/>
                    {"Rivalry"}
                </div>
                <span className={"block whitespace-pre-line"}>
                        {result}
                    </span>
            </>
        )

    }

    const getDreamTeams = () => {
        for (const game of games) {
            let teamIndex = 0;

            for (const team of game.teams) {
                for (const player of team) {
                    for (const teamMate of team) {

                        if (JSON.stringify(player) !== JSON.stringify(teamMate)) {

                            if (!extendedUsers[player].teamMates[teamMate]) {
                                extendedUsers[player].teamMates[teamMate] = {matches: 0, result: 0}
                            }
                            extendedUsers[player].teamMates[teamMate].matches++

                            if ((teamIndex === 0 && game.delta > 0) || (teamIndex === 1 && game.delta < 0)) {
                                extendedUsers[player].teamMates[teamMate].result++
                            }
                        }
                    }
                }
                teamIndex++;
            }
        }

        const {randomPlayer, randomInteractedPlayerKey, randomInteractedPlayer} = pickRandomObject("teamMates")

        let result = [(
            <span key={"teamstart"}>
                {"When "}
                <UserName user={randomPlayer}/>
                {" teams up with "}
                <UserName user={extendedUsers[randomInteractedPlayerKey]}/>
                {", they have "}
            </span>
        )]

        if (randomInteractedPlayer.matches) {
            const winPercent = Math.round((randomInteractedPlayer.result / randomInteractedPlayer.matches) * 100)
            if (winPercent) {
                result.push(<span key={"teamrate"}>{"a " + winPercent + "% winrate."}</span>)
            } else if (winPercent === 100) {
                result.push(<span key={"teamlost"}>{" never lost!"}</span>)
            } else {
                result.push(<span key={"teamwon"}>{" never won!"}</span>)
            }
        }

        return (
            <>
                <div
                    className={"flex items-center rounded bg-gradient-to-b from-gray-900 via-purple-900 to-violet-600 mr-2 text-white p-2 shine min-w-min"}
                >
                    <LightningBoltIcon className={"h-5 w-5 mr-1 min-w-min"}/>
                    {"Dream team"}
                </div>
                <span className={"block whitespace-pre-line"}>
                    {result}
                </span>
            </>
        )
    }

    const getColoring = () => {

        let result = [];
        let resultString = "Does color matter? ";
        const coloring = {
            "blue": 0,
            "red": 0
        }

        for (const game of games) {
            if (game.delta > 0) {
                coloring.blue++
            } else {
                coloring.red++
            }
        }

        result.push(resultString + "Reds beat blues " + Math.round(((coloring.red / (coloring.blue + coloring.red)) * 100)) + "% of the time.")
        result.push(resultString + "Blues beat reds " + Math.round(((coloring.blue / (coloring.blue + coloring.red)) * 100)) + "% of the time.")


        return (
            <>
                <div
                    className={"flex items-center rounded bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 mr-2 text-white p-2 shine min-w-min"}
                >
                    <ScaleIcon className={"h-5 w-5 mr-1 min-w-min"}/>
                    {"Racism"}
                </div>
                <span className={"block whitespace-pre-line"}>
                    {result[Math.floor(Math.random() * result.length)]}
                </span>
            </>
        )
    }

    const pickRandomObject = (arrayofObjectsKey) => {
        let randomPlayer = Object.values(extendedUsers)[Math.floor(Math.random() * Object.keys(extendedUsers).length)];

        while (!Object.keys(randomPlayer[arrayofObjectsKey]).length) {
            randomPlayer = Object.values(extendedUsers)[Math.floor(Math.random() * Object.keys(extendedUsers).length)];
        }
        const randomInteractedPlayerIndex = Math.floor(Math.random() * Object.keys(randomPlayer[arrayofObjectsKey]).length);
        const randomInteractedPlayerKey = Object.keys(randomPlayer[arrayofObjectsKey])[randomInteractedPlayerIndex];
        const randomInteractedPlayer = randomPlayer[arrayofObjectsKey][randomInteractedPlayerKey];
        return {randomPlayer, randomInteractedPlayerKey, randomInteractedPlayer}
    }

    return (
        <div className={"max-w-7xl mx-auto mb-8 bg-white p-4 relative"}>
            <div className={"text-center name pt-5 w-full flex justify-center"}>
                <div className={"flex flex-wrap md:flex-nowrap items-center justify-center max-w-full"}>
                    {generateFunFact()}
                </div>
            </div>
        </div>
    )
}

export default FunFacts