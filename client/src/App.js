import React, {useEffect, useState} from "react";
import axios from "axios";
import UserList from "./components/UserList";
import GameList from "./components/GameList";

function App() {

    const [users, setUsers] = useState({})
    const [games, setGames] = useState([])
    const [finishLoadingUsers, setFinishLoadingUsers] = useState(false)
    const [finishLoadingGames, setFinishLoadingGames] = useState(false)
    const serverUrl = 'https://us-central1-foosball-bot-1b613.cloudfunctions.net/app';


    useEffect(() => {
        getUserData()
        getGamesData()
        const interval = setInterval(() => {
            try {
                getUserData()
                getGamesData()
            } catch (error) {
                console.error(error)
            }
        }, 60000);
        return () => clearInterval(interval)
    },[]);

    const getUserData = async () => {
        const result = await axios(
            serverUrl + "getusers"
        )
        console.log(result.data)
        setUsers(result.data)
        setFinishLoadingUsers(true)
    }
    const getGamesData = async () => {
        const result = await axios(
            serverUrl + "getgames"
        )
        console.log(result.data)
        setGames(Object.values(result.data))
        setFinishLoadingGames(true)
    }

    return (
        <React.Fragment>
            <div className="container mx-auto p-4">
                <div className="text-center">
                    <h1 className="text-2xl">Slæckball</h1>
                </div>

                <UserList users={Object.values(users)} isLoaded={finishLoadingUsers}/>
                <GameList games={games} users={users} isLoaded={finishLoadingGames}/>
            </div>
        </React.Fragment>
    );
}

export default App;
