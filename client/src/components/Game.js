import React from "react";

const Game = ({game, users}) => {
    return (
        <>
            <p className={"px-4 py-3 hidden md:inline col-span-2"}>{game.uid}</p>
            {game.teams.map((team,index) =>
                <p className={"px-4 py-3 overflow-ellipsis overflow-hidden col-span-3"} key={index}>
                    {team.map((player, index) =>
                        <span key={player + Math.random()} className={'overflow-hidden overflow-ellipsis'}>
                            {users[player] &&
                                users[player].name
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
            <p className={"px-4 py-3 text-right md:text-left"}>{game.result}</p>
            <p className={"px-4 py-3 text-right hidden md:block"}>{game.delta ?? ""}</p>
        </>
    )
}

export default Game