import {SparklesIcon} from "@heroicons/react/outline";
import UserName from "../UserName";
import React from "react";
import {buildFunFact} from "./funFactHelpers";

export const getMostPlayedPlayer = (users) => {
    const mostGamesPlayed = Object.values(users).sort((a, b) => a.totalGames - b.totalGames).pop()
    return buildFunFact(
        <div
            className={"badge-icon bg-gradient-to-r from-purple-600 via-violet-900 to-purple-700"}>
            <SparklesIcon className={"h-5 w-5 mr-1"}/>
            {"Tryhard"}
        </div>,
        <span>
                <UserName user={mostGamesPlayed}/>
            {" has played a total of " + mostGamesPlayed.totalGames + " matches."}
            </span>
    )
}
