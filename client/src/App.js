import {Route, Switch} from "react-router-dom";
import Home from "./components/Home";
import UserProfile from "./components/UserProfile";
import React, {useEffect, useState} from "react";
import {getGamesData, getUserData} from "./fetch/Data";
import CurrentMatch from "./components/CurrentMatch";

function App() {
    const [users, setUsers] = useState({})
    const [games, setGames] = useState([])

    useEffect(() => {
        getUsers()
        getGames()
    }, []);

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
        <main>
            <Switch>
                <Route key={"/profile/:id"} exact path={"/profile/:id"}>
                    <UserProfile users={users} games={games}/>
                </Route>
                <Route key="/current-match" exact path={"/current-match"}>
                    <CurrentMatch/>
                </Route>
                <Route key="/" exact path={"/"}>
                    <Home users={users} games={games}/>
                </Route>

                <Route component={Error}/>
            </Switch>
        </main>
    );
}

export default App;
