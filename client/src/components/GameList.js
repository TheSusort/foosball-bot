import React from "react";
import Game from "./Game";

const GameList = ({games, users, isLoaded}) => {
    const showMax = 20

    if (isLoaded) {
        return (
            <div className={"max-w-4xl mx-auto mb-8 bg-white p-4 rounded rounded-lg shadow-lg overflow-hidden overflow-x-auto"}>
                <h2 className={"text-center text-2xl"}>History</h2>
                <div className="grid grid-flow-col auto-cols-fr text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                    <span className={"px-4 py-3 hidden md:inline col-span-2"}>date</span>
                    <span className={"px-4 py-3 col-span-3"}>team1</span>
                    <span className={"px-4 py-3 col-span-3"}>team2</span>
                    <span className={"px-4 py-3 text-right md:text-left"}>result</span>
                    <span className={"px-4 py-3 text-right hidden md:inline"}>delta</span>
                </div>
                <div className="flex flex-col mb-5 text-gray-700 divide-y divide-black divide-solid min-w-min">
                    {games
                        .sort((a, b) => b.uid - a.uid)
                        .slice(0, showMax)
                        .map(game => (
                            <div
                                key={game.uid}
                                className="grid grid-flow-col auto-cols-fr text-xs lg:text-base"
                            >
                                <Game game={game} users={users} />
                            </div>
                        ))}
                </div>
            </div>
        )
    }
    return (
        <>
            <div className="loader text-center mt-5">loading games</div>
        </>
    )
}

export default GameList;