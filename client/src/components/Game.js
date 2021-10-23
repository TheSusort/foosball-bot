import React from "react";
import {Link} from "react-router-dom";
import UserName from "./UserName";

const Game = ({game, users, emojis}) => {
    const date = new Date(Number(game.uid))
    const dateString = [date.getDate(), date.getMonth() + 1, date.getFullYear()].join("/")

    return (
        <>
            <p className={"compact-grid-cell hidden md:inline col-span-2"}>{dateString}</p>
            {game.teams.map((team, index) =>
                <p className={"compact-grid-cell overflow-ellipsis overflow-hidden col-span-3"} key={index}>
                    {team.map((player, index) =>
                        <span key={player + Math.random()} className={'name'}>
                            {users[player] &&
                            <Link to={`/profile/${users[player].userId}`}>
                                <UserName user={users[player]} emojis={emojis} size={"h-3.5"}/>
                            </Link>
                            }
                            {!users[player] &&
                            player
                            }
                            {index < team.length - 1 &&
                            <> / </>
                            }
                        </span>
                    )}
                </p>
            )}
            <p className={"compact-grid-cell text-right md:text-left whitespace-nowrap"}>{game.result}</p>
            <p className={"compact-grid-cell text-right hidden md:block"}>{Math.round(Number(game.delta)) ?? ""}</p>
        </>
    )
}

export default Game