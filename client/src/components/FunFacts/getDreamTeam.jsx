import {buildFunFact, pickRandomObject} from "./funFactHelpers";
import UserName from "../UserName";
import {BoltIcon} from "@heroicons/react/24/outline";
import React from "react";

export const getDreamTeams = (games, extendedUsers) => {
    // Safety checks
    if (!games || !Array.isArray(games) || games.length === 0) {
        return buildFunFact(
            <div className={"badge-icon bg-gradient-to-b from-gray-900 via-purple-900 to-violet-600"}>
                <BoltIcon className={"h-5 w-5 mr-1 min-w-min"}/>
                {"Dream team"}
            </div>,
            [<span key="no-games">No games found for dream team analysis</span>]
        );
    }

    if (!extendedUsers || Object.keys(extendedUsers).length === 0) {
        return buildFunFact(
            <div className={"badge-icon bg-gradient-to-b from-gray-900 via-purple-900 to-violet-600"}>
                <BoltIcon className={"h-5 w-5 mr-1 min-w-min"}/>
                {"Dream team"}
            </div>,
            [<span key="no-users">No users found for dream team analysis</span>]
        );
    }

    // Optimize: Process each game once and track team wins/losses
    for (const game of games) {
        if (!game.teams || game.teams.length < 2) continue;

        const team1 = game.teams[0] || [];
        const team2 = game.teams[1] || [];
        const team1Won = game.delta > 0;

        // Process team 1 players
        for (let i = 0; i < team1.length; i++) {
            for (let j = i + 1; j < team1.length; j++) {
                const player1 = team1[i];
                const player2 = team1[j];

                if (!extendedUsers[player1].teamMates[player2]) {
                    extendedUsers[player1].teamMates[player2] = {matches: 0, result: 0};
                }
                if (!extendedUsers[player2].teamMates[player1]) {
                    extendedUsers[player2].teamMates[player1] = {matches: 0, result: 0};
                }

                extendedUsers[player1].teamMates[player2].matches++;
                extendedUsers[player2].teamMates[player1].matches++;

                if (team1Won) {
                    extendedUsers[player1].teamMates[player2].result++;
                    extendedUsers[player2].teamMates[player1].result++;
                }
            }
        }

        // Process team 2 players
        for (let i = 0; i < team2.length; i++) {
            for (let j = i + 1; j < team2.length; j++) {
                const player1 = team2[i];
                const player2 = team2[j];

                if (!extendedUsers[player1].teamMates[player2]) {
                    extendedUsers[player1].teamMates[player2] = {matches: 0, result: 0};
                }
                if (!extendedUsers[player2].teamMates[player1]) {
                    extendedUsers[player2].teamMates[player1] = {matches: 0, result: 0};
                }

                extendedUsers[player1].teamMates[player2].matches++;
                extendedUsers[player2].teamMates[player1].matches++;

                if (!team1Won) {
                    extendedUsers[player1].teamMates[player2].result++;
                    extendedUsers[player2].teamMates[player1].result++;
                }
            }
        }
    }

    const {
        randomChildObject,
        randomChildObjectArrayKey,
        randomChildObjectArrayValue
    } = pickRandomObject("teamMates", extendedUsers)

    // Safety check for pickRandomObject result
    if (!randomChildObject || !randomChildObjectArrayKey || !randomChildObjectArrayValue) {
        return buildFunFact(
            <div className={"badge-icon bg-gradient-to-b from-gray-900 via-purple-900 to-violet-600"}>
                <BoltIcon className={"h-5 w-5 mr-1 min-w-min"}/>
                {"Dream team"}
            </div>,
            [<span key="no-teams">No team combinations found</span>]
        );
    }

    let result = [(
        <span key={"teamstart"}>
                {"When "}
            <UserName user={randomChildObject}/>
            {" teams up with "}
            <UserName user={extendedUsers[randomChildObjectArrayKey]}/>
            {", they have "}
            </span>
    )]

    if (randomChildObjectArrayValue.matches) {
        const winPercent = Math.round((randomChildObjectArrayValue.result / randomChildObjectArrayValue.matches) * 100)
        if (winPercent) {
            result.push(<span key={"teamrate"}>{"a " + winPercent + "% winrate."}</span>)
        } else if (winPercent === 100) {
            result.push(<span key={"teamlost"}>{" never lost!"}</span>)
        } else {
            result.push(<span key={"teamwon"}>{" never won!"}</span>)
        }
    }

    return buildFunFact(
        <div
            className={"badge-icon bg-gradient-to-b from-gray-900 via-purple-900 to-violet-600"}
        >
            <BoltIcon className={"h-5 w-5 mr-1 min-w-min"}/>
            {"Dream team"}
        </div>,
        result
    )
}