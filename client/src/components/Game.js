import React from "react";
import {Link} from "react-router-dom";
import UserName from "./UserName";

const Game = ({game, users}) => {

    const result = game.result.split("-");
    const resultClassMapping = {
        '0': 'w-0',
        '1': 'w-1/12',
        '2': 'w-3/12',
        '3': 'w-4/12',
        '4': 'w-5/12',
        '5': 'w-6/12',
        '6': 'w-7/12',
        '7': 'w-8/12',
        '8': 'w-10/12',
        '9': 'w-11/12',
        '10': 'w-full',

    }

    const date = new Date(Number(game.uid))
    const dateString = [date.getDate(), date.getMonth() + 1, date.getFullYear()].join("/")
    const perfectGame = game.result === "10-0" || game.result === "0-10";
    const perfectGameWinner = perfectGame ? (
        game.result === "10-0" ? 0 : 1
    ) : undefined

    return (
        <div
            key={game.uid}
            className={"grid grid-flow-col auto-cols-fr text-xs lg:text-base "}
        >
            <p className={"compact-grid-cell hidden md:inline col-span-2"}>{dateString}</p>
            {game.teams.map((team, index) =>
                <p className={
                    "compact-grid-cell col-span-3 flex " +
                    "items-center flex-wrap relative " +
                    "after:pointer-events-none " +
                    "after:top-0 after:absolute after:h-full after:block after:bg-opacity-20 " +
                    "after:" + (index ? "left-0" : "right-0") +
                    " after:bg-" + (index ? "red" : "blue") + "-500 after:" + resultClassMapping[result[index]] +
                    (index === perfectGameWinner ? " legend text-white after:bg-transparent" : "") +
                    (perfectGameWinner !== undefined && index !== perfectGameWinner ? " clown after:bg-transparent" : "")
                }
                   key={index}>
                    {team.map((player, index) =>
                        <span key={player + Math.random()}
                              className={"inline max-w-full overflow-hidden overflow-ellipsis z-10"}>
                            <span className={'name'}>
                                {users[player] &&
                                <Link to={`/profile/${users[player].userId}`}>
                                    <UserName user={users[player]} size={"h-3.5 lg:h-5"}/>
                                </Link>
                                }
                                {!users[player] &&
                                player
                                }

                                {index < team.length - 1 &&
                                <span className={"px-1"}> / </span>
                                }
                            </span>
                        </span>
                    )}
                </p>
            )}
            <p className={"compact-grid-cell text-right md:text-left whitespace-nowrap" + (perfectGame ? " font-extrabold animate-zoom text-gold" : "")}>
                {game.result}
            </p>
            <p className={"compact-grid-cell text-right hidden md:block"}>{Math.round(Number(game.delta)) ?? ""}</p>
        </div>
    )
}

export default Game