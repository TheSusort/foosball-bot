import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getGamesData, getUserData} from "../fetch/Data";
import GameList from "./GameList";
import DetailedUser from "./DetailedUser";
import {CSSTransition} from "react-transition-group";
import LoadingIndicator from "./LoadingIndicator";

const UserProfile = (props) => {
    let {id} = useParams()
    const [user, setUser] = useState({})
    const [users, setUsers] = useState(props.users)
    const [games, setGames] = useState(props.games)
    const [filteredGames, setFilteredGames] = useState(props.games);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        let filter = games.filter(game => {
            let incl = game.teams.map(team => {
                return team.includes(id)
            })

            if (incl.includes(true)) {
                return game
            } else {
                return false
            }
        })
        setFilteredGames(
            filter
        )
    }, [games, id])

    useEffect(() => {
        getUser(id)
        getUsers()
        getGames()
        setLoading(true)
        setTimeout(() => setLoading(false), 1000)
    }, [id])

    const getUser = async (userId) => {
        getUserData(userId).then((response) => {
            setUser(response)
        })
    }

    const getUsers = async () => {
        getUserData().then((response) => {
            setUsers(response)
        })
    }

    const getGames = async () => {
        getGamesData().then((response) => {
            setGames(Object.values(response))
        })
    }

    return (
        <>
            <LoadingIndicator loading={loading}/>
            <CSSTransition
                key={"profile"}
                in={!loading}
                timeout={500}
                classNames="fade"
                unmountOnExit
            >
                <div className="container mx-auto p-4 ">
                    <div className="text-center my-5">
                        <h1 className="text-4xl">Slæckball 3000</h1>
                    </div>
                    <DetailedUser {...user} />
                    <GameList users={users} games={filteredGames}/>

                </div>
            </CSSTransition>
        </>
    )
}

export default UserProfile