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

    const {
        randomChildObject,
        randomChildObjectArrayKey,
        randomChildObjectArrayValue
    } = pickRandomObject("rivals", extendedUsers)

    let result = [(
        <span key={"startrivals"}>
                <UserName user={randomChildObject}/>
            {" has gone toe to toe with "}
            <UserName user={extendedUsers[randomChildObjectArrayKey]}/>
            {" " + randomChildObject.rivals[randomChildObjectArrayKey].matches + " times, and "}
            </span>
    )]

    if (randomChildObjectArrayValue.matches) {
        const winPercent = Math.round((randomChildObjectArrayValue.result / randomChildObjectArrayValue.matches) * 100)
        if (winPercent) {
            result.push(<span key={"winraterivals"}>{"wins " + winPercent + "% of the time."}</span>)
        } else if (winPercent === 100) {
            result.push(<span key={"lostrivals"}>{"has never lost!"}</span>)
        } else {
            result.push(<span key={"wonrivals"}>{"has never won!"}</span>)
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