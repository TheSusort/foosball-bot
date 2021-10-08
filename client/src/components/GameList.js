import React from "react";
import Game from "./Game";

const GameList = ({games, users, isLoaded}) => {
    const showMax = 20

    if (isLoaded) {
        return (
            <>
                <div className="grid grid-cols-5">
                    <span>date</span>
                    <span>team1</span>
                    <span>team2</span>
                    <span>result</span>
                    <span>delta</span>
                </div>
                <div className="flex flex-col">
                    {games
                        .sort((a, b) => b.uid - a.uid)
                        .slice(0, showMax)
                        .map(game => (
                            <div
                                key={game.uid}
                                className="grid grid-cols-5"
                            >
                                <Game game={game} users={users} />
                            </div>
                        ))}
                </div>
            </>
        )
    }
    return (
        <>
            <div className="loader">loading games</div>
        </>
    )
}

export default GameList;