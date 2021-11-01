import React, {useEffect} from "react";
import Game from "./Game";
import {useDispatch, useSelector} from "react-redux";
import {fetchGames, selectAllGames} from "../reducers/games";
import {fetchUsers, selectAllUsers} from "../reducers/users";
import FunFacts from "./FunFacts";

const GameList = ({filter}) => {

    const showMax = 20
    const games = Object.values(useSelector(selectAllGames));
    const users = useSelector(selectAllUsers);
    const dispatch = useDispatch()
    const gamesStatus = useSelector(state => state.games.status)
    const gamesError = useSelector(state => state.games.error)
    const usersStatus = useSelector(state => state.users.status)
    const usersError = useSelector(state => state.users.error)

    let filteredGames = games;

    if (filter) {
        filteredGames = games.filter(game => {
            let incl = game.teams.map(team => {
                return team.includes(filter)
            })

            if (incl.includes(true)) {
                return game
            } else {
                return false
            }
        })
    }

    useEffect(() => {
        if (gamesStatus === "idle") {
            dispatch(fetchGames())
            dispatch(fetchUsers())
        }
    }, [dispatch, gamesStatus])

    let content, funfacts;

    if (gamesStatus === "loading" || usersStatus === "loading") {
    } else if (gamesStatus === "succeeded" || usersStatus === "succeeded") {

        content = filteredGames
            .sort((a, b) => b.uid - a.uid)
            .slice(0, showMax)
            .map((game, index) => (
                <Game
                    key={index}
                    game={game}
                    users={users}
                />
            ))

        funfacts = <FunFacts users={users} games={games}/>
    } else if (gamesStatus === "error" || usersStatus === "error") {
        content = <div>{gamesError || usersError}</div>
        funfacts = <div>{gamesError || usersError}</div>
    }

    return (
        <div
            className={"max-w-7xl mx-auto mb-8 bg-white p-4 rounded rounded-lg shadow-lg overflow-hidden overflow-x-auto"}>
            <h2 className={"text-center text-2xl"}>History</h2>
            {funfacts}
            <div
                className="grid grid-flow-col auto-cols-fr text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                <span className={"compact-grid-cell hidden md:inline col-span-2"}>date</span>
                <span className={"compact-grid-cell col-span-3"}>team1</span>
                <span className={"compact-grid-cell col-span-3"}>team2</span>
                <span dir="rtl" className={"compact-grid-cell text-right md:text-left"}>result</span>
                <span className={"compact-grid-cell text-right hidden md:inline"}>delta</span>
            </div>
            <div className="flex flex-col mb-5 text-gray-700 divide-y divide-black divide-solid min-w-min">
                {content}
            </div>
        </div>
    )

}

export default GameList;