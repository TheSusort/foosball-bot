import {buildFunFact} from "./funFactHelpers";
import {ScaleIcon} from "@heroicons/react/outline";
import React from "react";

export const getColoring = (games) => {

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

    result.push(
        resultString + "Reds beat blues " +
        Math.round(((coloring.red / (coloring.blue + coloring.red)) * 100)) + "% of the time."
    )
    result.push(
        resultString + "Blues beat reds " +
        Math.round(((coloring.blue / (coloring.blue + coloring.red)) * 100)) + "% of the time."
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