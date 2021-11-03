import {buildFunFact, pickRandomObject} from "./funFactHelpers";
import {HeartIcon} from "@heroicons/react/outline";
import React from "react";
import UserName from "../UserName";

export const getInteractions = (users) => {

    const {randomChildObject, randomChildObjectArrayKey, randomChildObjectArrayValue} = pickRandomObject("exp", users)
    const percentage = Math.round((randomChildObjectArrayValue / randomChildObject.exp.channel) * 100) + "%"

    const resultType = [
        "numbers",
        "percentage"
    ]

    const expTypeMapping = {
        "rek": "getting rekt",
        "meme": "laughing at memes",
        "game": "playing the game",
        "bot": "talking to the bot"
    }

    let result = [<UserName key={"intuser"} user={randomChildObject}/>]

    switch (resultType[Math.floor(Math.random() * resultType.length)]) {
        case "percentage":
            if (randomChildObjectArrayKey !== "channel") {
                result.push(<span
                    key={"intperc"}>{" has spent " + percentage + " of their interactions on " + expTypeMapping[randomChildObjectArrayKey]}</span>)
            } else {
                result.push(<span
                    key={"intpercchan"}>{" has posted " + randomChildObjectArrayValue + " times in the slack channel."}</span>)
            }
            break;
        case "numbers":
            switch (randomChildObjectArrayKey) {

                case 'channel':
                    result.push(<span
                        key={"intcha"}>{" has posted " + randomChildObjectArrayValue + " times in the slack channel."}</span>)
                    break;
                case 'rek':
                    if (randomChildObjectArrayValue > 10) {
                        result.push(<span
                            key={"intrek"}>{" is a true sadomasochist, and has requested to be whipped " + randomChildObjectArrayValue +
                        " times by the Slæckball3000s sharp tongue."}</span>)
                    } else {
                        result.push(<span key={"intrek1"}>{" has been rekt " + randomChildObjectArrayValue +
                        " times."}</span>)
                    }
                    break;
                case 'meme':
                    if (randomChildObjectArrayValue > 10) {
                        result.push(<span
                            key={"intmeme"}>{" is has to be thristy, after getting spicy memes " + randomChildObjectArrayValue +
                        " times"}</span>)
                    } else {
                        result.push(<span key={"intmeme1"}>{" has fished for memes " + randomChildObjectArrayValue +
                        " times."}</span>)
                    }
                    break;
                case 'game':
                    if (randomChildObjectArrayValue > 50) {
                        result.push(<span
                            key={"intgame"}>{" is a hardcore gamer, interacting with the game mechanics " + randomChildObjectArrayValue +
                        " times"}</span>)
                    } else {
                        result.push(<span
                            key={"intgame1"}>{" has interacted with the game " + randomChildObjectArrayValue +
                        " times."}</span>)
                    }
                    break;
                case 'bot':
                    if (randomChildObjectArrayValue > 50) {
                        result.push(<span
                            key={"intbot"}>{" has a crush on the bot, or is really lonely. Bot sass was requested " +
                        randomChildObjectArrayValue + " times"}</span>)
                    } else {
                        result.push(<span
                            key={"intbot1"}>{" has interacted with the bot " + randomChildObjectArrayValue +
                        " times."}</span>)
                    }
                    break;
                default:
                    result.push(<span key={"intdef"}>{" has experience is unknown subjects"}</span>)
            }
            break;

        default:
            result.push(<span key={"intdef"}>{" has experience is unknown subjects"}</span>)
            break;
    }


    return buildFunFact(
        <div
            className={"badge-icon bg-gradient-to-b from-pink-500 via-purple-900 to-red-700"}
        >
            <HeartIcon className={"h-5 w-5 mr-1 min-w-min"}/>
            {"Slack Champ"}
        </div>,
        <>{result}</>
    )
}