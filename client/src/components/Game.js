import React from "react";

const Game = ({game, users}) => {
    return (
        <>
            <p>{game.uid}</p>
            {game.teams.map((team,index) =>
                <p key={index}>
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
            <p>{game.result}</p>
            <p>{game.delta ?? ""}</p>
        </>
    )
}

export default Game