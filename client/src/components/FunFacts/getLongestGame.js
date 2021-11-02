import React from "react";
import {buildFunFact} from "./funFactHelpers";
import {ClockIcon} from "@heroicons/react/outline";
import UserName from "../UserName";

export const getLongestGame = (games, users) => {
    const timeData = {
        match: {},
        time: 0
    }

    for (const game of games) {
        if (game.time && game.time > timeData.time) {
            timeData.time = game.time;
            timeData.match = game
        }
    }

    if (timeData.match.time) {

        const time = new Date((timeData.time) * 1000);

        const setupString = timeData.match.teams.map((team) => {
            return team.map((playerId) => users[playerId]);
        }).flat()

        return buildFunFact(
            <div
                className={"badge-icon bg-gradient-to-tl from-green-300 via-green-900 to-gray-500"}
            >
                <ClockIcon className={"h-5 w-5 mr-1 min-w-min"}/>
                {"Slowpokes"}
            </div>,
            <>
                {"The longest game was between "}
                {setupString.map((user, index) =>

                    <span key={"longestgamepart" + index}>
                        <UserName user={user}/>
                        {index < setupString.length &&
                        ", "
                        }

                    </span>
                )}
                {" and lasted a whole " + (time.getMinutes() ? time.getMinutes() + " minutes and " : "") + time.getSeconds() + " seconds."}
            </>
        )
    }
}