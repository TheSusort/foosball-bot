import React from "react";
import {Link} from "react-router-dom";
import UserName from "./UserName";

const Game = ({game, users}) => {


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
                    "compact-grid-cell overflow-ellipsis overflow-hidden col-span-3 flex " +
                    "items-center flex-wrap " + (index === perfectGameWinner ? "legend text-white" : "")
                }
                   key={index}>
                    {team.map((player, index) =>

                        <span key={player + Math.random()} className={"flex items-center flex-wrap"}>
                            <span className={'name'}>
                                {users[player] &&
                                <Link to={`/profile/${users[player].userId}`}>
                                    <UserName user={users[player]} size={"h-3.5 lg:h-5"}/>
                                </Link>
                                }
                                {!users[player] &&
                                player
                                }

                            </span>
                            {index < team.length - 1 &&
                            <span className={"px-1"}> / </span>
                            }
                        </span>
                    )}
                </p>
            )}
            <p className={"compact-grid-cell text-right md:text-left whitespace-nowrap"}>{game.result}</p>
            <p className={"compact-grid-cell text-right hidden md:block"}>{Math.round(Number(game.delta)) ?? ""}</p>
        </div>
    )
}

export default Game