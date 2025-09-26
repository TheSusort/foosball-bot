import React from "react";
import {buildFunFact} from "./funFactHelpers";
import {ClockIcon} from "@heroicons/react/24/outline";

export const getAverageTimeSpent = (games) => {
    const timeData = {
        matches: 0,
        timeSpent: 0
    }

    for (const game of games) {
        if (game.time) {
            timeData.matches++
            timeData.timeSpent += Number(game.time)
        }
    }

    const time = new Date((timeData.timeSpent / timeData.matches) * 1000);

    if (timeData.matches) {
        return buildFunFact(
            <div
                className={"badge-icon bg-gradient-to-bl from-indigo-900 via-blue-700 to-gray-500"}
            >
                <ClockIcon className={"h-5 w-5 mr-1 min-w-min"}/>
                {"Procrastination"}
            </div>,
            "Average time spent per game is " + (time.getMinutes() ? time.getMinutes() + " minutes and " : "") + time.getSeconds() + " seconds"
        )
    }
}