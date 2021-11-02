import React from "react";
import {buildFunFact} from "./funFactHelpers";
import {LightningBoltIcon} from "@heroicons/react/outline";
import UserName from "../UserName";

export const getShortestGame = (games, users) => {
    const timeData = {
        match: {},
        time: 0
    }

    for (const game of games) {
        if (game.time && timeData.time === 0) {
            timeData.time = game.time
        }

        if (game.time && game.time < timeData.time) {
            timeData.time = game.time;
            timeData.match = game
        }
    }


    if (timeData.match) {
        const time = new Date((timeData.time) * 1000);

        const setupString = timeData.match.teams.map((team) => {
            return team.map((playerId) => users[playerId]);
        }).flat()

        return buildFunFact(
            <div
                className={"badge-icon bg-gradient-to-r from-red-600 to-gold"}
            >
                <LightningBoltIcon className={"h-5 w-5 mr-1 min-w-min"}/>
                {"Speedy Gonzales"}
            </div>,
            <>
                {"The shortest game was between "}
                {setupString.map((user, index) =>

                    <span key={"shortestgamepart" + index}>
                        <UserName user={user}/>
                        {index < setupString.length &&
                        ", "
                        }

                    </span>
                )}
                {" and only lasted " + (time.getMinutes() ? time.getMinutes() + " minutes and " : "") + time.getSeconds() + " seconds."}
            </>
        )
    }
}