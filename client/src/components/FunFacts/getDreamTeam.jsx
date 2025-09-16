import {buildFunFact, pickRandomObject} from "./funFactHelpers";
import UserName from "../UserName";
import {BoltIcon} from "@heroicons/react/24/outline";
import React from "react";

export const getDreamTeams = (games, extendedUsers) => {
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

    const {
        randomChildObject,
        randomChildObjectArrayKey,
        randomChildObjectArrayValue
    } = pickRandomObject("teamMates", extendedUsers)

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