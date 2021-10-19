import {Route, Switch} from "react-router-dom";
import Home from "./components/Home";
import UserProfile from "./components/UserProfile";
import React, {useEffect, useState} from "react";
import {getGamesData, getUserData} from "./fetch/Data";
import {CSSTransition} from "react-transition-group";
import LoadingIndicator from "./components/LoadingIndicator";

function App() {
    const [users, setUsers] = useState({})
    const [games, setGames] = useState([])
    const [loading, setLoading] = useState(true);


    console.log(loading)
    useEffect(() => {
        getUsers()
        getGames()
        setTimeout(() => setLoading(false), 2000)
    }, []);

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
            <CSSTransition
                in={loading}
                timeout={300}
                classNames="fade"
                onEnter={() => console.log("loader enter")}
                onEntering={() => console.log("loader entering")}
                onEntered={() => {
                    console.log("loader entered")
                }}
                onExit={() => console.log("loader exit")}
                onExiting={() => console.log("loader exiting")}
                onExited={() => {
                    console.log("loader exited");
                    setLoading(false)
                    console.log(loading)
                }}
                unmountOnExit
            >
                <LoadingIndicator loading={loading}/>
            </CSSTransition>

            <Switch>
                <Route key={"/profile/:id"} exact path={"/profile/:id"}>
                    <CSSTransition
                        in={!loading}
                        timeout={1000}
                        classNames="fade"
                        onEnter={() => console.log("loader enter")}
                        onEntering={() => console.log("loader entering")}
                        onEntered={() => {
                            console.log("loader entered")
                        }}
                        onExit={() => console.log("loader exit")}
                        onExiting={() => console.log("loader exiting")}
                        onExited={() => console.log("loader exited")}
                        unmountOnExit
                    >
                        <UserProfile users={users} games={games}/>
                    </CSSTransition>
                </Route>
                <Route key="/" exact path={"/"}>
                    <CSSTransition
                        in={!loading}
                        timeout={1000}
                        classNames="fade"
                        onEnter={() => console.log("loader enter")}
                        onEntering={() => console.log("loader entering")}
                        onEntered={() => {
                            console.log("loader entered")
                        }}
                        onExit={() => console.log("loader exit")}
                        onExiting={() => console.log("loader exiting")}
                        onExited={() => console.log("loader exited")}
                        unmountOnExit
                    >
                        <Home users={users} games={games}/>
                    </CSSTransition>
                </Route>

                <Route component={Error}/>
            </Switch>
        </main>
    );
}

export default App;
