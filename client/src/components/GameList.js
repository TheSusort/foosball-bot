import React from "react";

const GameList = ({games}) => {
    const showMax = 50
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
                        <p>{game.uid}</p>
                        <p>{game.team1}</p>
                        <p>{game.team2}</p>
                        <p>{game.result}</p>
                        <p>{game.delta ?? ""}</p>
                    </div>
                ))}
            </div>
        </>
    )
}

export default GameList;