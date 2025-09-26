import React, {useEffect, useState, useMemo, useCallback} from "react";
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

    // Memoize expensive computation to prevent recalculation on every render
    const extendedUsers = useMemo(() => {
        const result = {}
        for (const user in users) {
            result[user] = {
                name: users[user].name,
                totalGames: users[user].totalGames,
                rivals: {},
                teamMates: {},
                exp: users[user].exp
            }
        }
        return result
    }, [users])

    // Memoize the fun fact generation to prevent recreation on every render
    const generateFunFact = useCallback(() => {
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
    }, [users, games, extendedUsers])

    const [funFact, setFunFact] = useState(() => generateFunFact());

    useEffect(() => {
        const interval = setInterval(() => setFunFact(generateFunFact()), 15000)
        return () => clearInterval(interval)
    }, [generateFunFact]) // Add dependency array to prevent infinite re-renders

    return (
        <div className={"max-w-7xl mx-auto bg-white p-4 relative"}>
            <div className={"text-center name w-full flex justify-center"}>
                <div className={"flex flex-wrap md:flex-nowrap items-center justify-center max-w-full"}>
                    {funFact}
                </div>
            </div>
        </div>
    )
}

export default FunFacts