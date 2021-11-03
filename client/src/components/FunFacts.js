import React from "react";
import {getMostPlayedPlayer} from "./FunFacts/getMostPlayedPlayer";
import {getLeastPlayedPlayer} from "./FunFacts/getLeastPlayedPlayer";
import {getRivals} from "./FunFacts/getRivals";
import {getDreamTeams} from "./FunFacts/getDreamTeam";
import {getColoring} from "./FunFacts/getColoring";
import {getAverageTimeSpent} from "./FunFacts/getAverageTimeSpent";
import {getLongestGame} from "./FunFacts/getLongestGame";
import {getShortestGame} from "./FunFacts/getShortestGame";
import {getInteractions} from "./FunFacts/getInteractions";

const FunFacts = ({users, games}) => {

    let extendedUsers = {}
    for (const user in users) {
        extendedUsers[user] = {
            name: users[user].name,
            totalGames: users[user].totalGames,
            rivals: {},
            teamMates: {},
            exp: users[user].exp
        }
    }

    const generateFunFact = () => {
        const factType = [
            "most",
            "least",
            "rival",
            "dreamteam",
            "coloring",
            "timespent",
            "longestgame",
            "shortestgame",
            "interactions"
        ]

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
                funFact = getRivals(games, extendedUsers)
                break;

            case "dreamteam":
                // dream team
                funFact = getDreamTeams(games, extendedUsers)
                break;

            case "coloring":
                funFact = getColoring(games)
                break;

            case "timespent":
                funFact = getAverageTimeSpent(games)
                break;

            case "longestgame":
                funFact = getLongestGame(games, users)
                break;

            case "shortestgame":
                funFact = getShortestGame(games, users)
                break;

            case "interactions":
                funFact = getInteractions(users)
                break;

            default:
                funFact = "no fun facts found"
                break
        }

        return funFact
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