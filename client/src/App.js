import {Route, Switch} from "react-router-dom";
import Home from "./components/Home";
import UserProfile from "./components/UserProfile";
import React from "react";
import CurrentMatch from "./components/CurrentMatch";

function App() {

    return (
        <main>
            <Switch>
                <Route key={"/profile/:id"} exact path={"/profile/:id"}>
                    <UserProfile/>
                </Route>
                <Route key="/current-match" exact path={"/current-match"}>
                    <CurrentMatch/>
                </Route>
                <Route key="/" exact path={"/"}>
                    <Home/>
                </Route>

                <Route component={Error}/>
            </Switch>
        </main>
    );
}

export default App;
