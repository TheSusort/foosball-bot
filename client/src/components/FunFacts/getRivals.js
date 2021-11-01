import UserName from "../UserName";
import {buildFunFact, pickRandomObject} from "./funFactHelpers";
import {FireIcon} from "@heroicons/react/outline";
import React from "react";

export const getRivals = (games, extendedUsers) => {

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

    const {randomPlayer, randomInteractedPlayerKey, randomInteractedPlayer} = pickRandomObject("rivals", extendedUsers)

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

    return buildFunFact(
        <div
            className={"badge-icon bg-gradient-to-r from-gray-600 via-gray-900 to-black"}
        >
            <FireIcon className={"h-5 w-5 mr-1 min-w-min"}/>
            {"Rivalry"}
        </div>,
        result
    )
}