
import {Route, Switch} from "react-router-dom";
import Home from "./components/Home";
import UserProfile from "./components/UserProfile";
import {useEffect, useState} from "react";
import {getGamesData, getUserData} from "./fetch/Data";

function App() {
    const [users, setUsers] = useState({})
    const [games, setGames] = useState([])

    useEffect(() => {
        getUsers()
        getGames()
    },[]);

    const getUsers = async () => {
        getUserData().then((response) => {
            console.log(response)
            setUsers(response)
        })

    }

    const getGames = async () => {
        getGamesData().then((response) => {
            console.log(response)
            setGames(Object.values(response))
        })
    }


    return (
        <main>
            <Switch>
                <Route exact path={"/profile/:id"}>
                    <UserProfile users={users} games={games} />
                </Route>
                <Route path={"/"} >
                    <Home users={users} games={games} />
                </Route>

                <Route component={Error} />
            </Switch>
        </main>
    );
}

export default App;
