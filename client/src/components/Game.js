import React from "react";
import {Link} from "react-router-dom";

const Game = ({game, users}) => {
    const date = new Date(Number(game.uid))

    return (
        <>
            <p className={"compact-grid-cell hidden md:inline col-span-2"}>{date.toLocaleString('nb-NO')}</p>
            {game.teams.map((team,index) =>
                <p className={"compact-grid-cell overflow-ellipsis overflow-hidden col-span-3"} key={index}>
                    { team.map((player, index) =>
                        <span key={player + Math.random()} className={'name block'}>
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
            <p className={"compact-grid-cell text-right md:text-left whitespace-nowrap"}>{game.result}</p>
            <p className={"compact-grid-cell text-right hidden md:block"}>{game.delta ?? ""}</p>
        </>
    )
}

export default Game