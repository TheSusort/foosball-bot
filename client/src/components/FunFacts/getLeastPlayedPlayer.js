import {buildFunFact} from "./funFactHelpers";
import {MoonIcon} from "@heroicons/react/outline";
import UserName from "../UserName";
import React from "react";

export const getLeastPlayedPlayer = (users) => {
    const leastGamesPlayed = Object.values(users).sort((a, b) => b.totalGames - a.totalGames).pop()
    return buildFunFact(
        <div
            className={"badge-icon bg-gradient-to-r from-green-300 to-green-600"}>
            <MoonIcon className={"h-5 w-5 mr-1"}/>
            {"Casual"}
        </div>,
        <span>
                <UserName user={leastGamesPlayed}/>
            {" has played a total of " + leastGamesPlayed.totalGames + " matches."}
            </span>
    )
}