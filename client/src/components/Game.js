import React from "react";
import {Link} from "react-router-dom";

const Game = ({game, users}) => {
    const date = new Date(Number(game.uid))

    return (
        <>
            <p className={"px-4 py-3 hidden md:inline col-span-2"}>{date.toLocaleString('nb-NO')}</p>
            {game.teams.map((team,index) =>
                <p className={"px-4 py-3 overflow-ellipsis overflow-hidden col-span-3"} key={index}>
                    { team.map((player, index) =>
                        <span key={player + Math.random()} className={'overflow-hidden overflow-ellipsis'}>
                            {users[player] &&
                                <Link to={`/profile/${users[player].userId}`}>{users[player].name}</Link>
                            }
                            {!users[player] &&
                                player
                            }
                            {index < team.length - 1 &&
                                <> / </>
                            }
                        </span>
                    ) }
                </p>
            )}
            <p className={"px-4 py-3 text-right md:text-left"}>{game.result}</p>
            <p className={"px-4 py-3 text-right hidden md:block"}>{game.delta ?? ""}</p>
        </>
    )
}

export default Game