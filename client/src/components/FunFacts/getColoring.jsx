import {buildFunFact} from "./funFactHelpers";
import {ScaleIcon} from "@heroicons/react/24/outline";
import React from "react";
import {getTeamColors} from "../../utils/colors";

export const getColoring = (games) => {
    const colors = getTeamColors();
    let result = [];
    let resultString = "Does color matter? ";
    const coloring = {
        [colors.team1.color]: 0,
        [colors.team2.color]: 0
    }

    for (const game of games) {
        if (game.delta > 0) {
            coloring[colors.team1.color]++
        } else {
            coloring[colors.team2.color]++
        }
    }

    result.push(
        resultString + `${colors.team2.name} beat ${colors.team1.name} ` +
        Math.round(((coloring[colors.team2.color] / (coloring[colors.team1.color] + coloring[colors.team2.color])) * 100)) + "% of the time."
    )
    result.push(
        resultString + `${colors.team1.name} beat ${colors.team2.name} ` +
        Math.round(((coloring[colors.team1.color] / (coloring[colors.team1.color] + coloring[colors.team2.color])) * 100)) + "% of the time."
    )


    return buildFunFact(
        <div
            className={"badge-icon bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"}
        >
            <ScaleIcon className={"h-5 w-5 mr-1 min-w-min"}/>
            {"Racism"}
        </div>,
        result[Math.floor(Math.random() * result.length)]
    )

}