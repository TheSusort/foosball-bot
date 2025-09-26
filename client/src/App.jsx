import {Route, Routes} from "react-router-dom";
import Home from "./components/Home.jsx";
import UserProfile from "./components/UserProfile.jsx";
import React, {useEffect} from "react";
import CurrentMatch from "./components/CurrentMatch.jsx";
import ColorTest from "./components/ColorTest.jsx";
import {useDispatch} from "react-redux";
import {fetchEmojis} from "./reducers/emojis";
import {fetchUsers} from "./reducers/users";
import {fetchGames} from "./reducers/games";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        // Fetch data once when the app loads
        dispatch(fetchUsers());
        dispatch(fetchGames());
        dispatch(fetchEmojis());
    }, [dispatch]);

    return (
        <main>
            <Routes>
                <Route path="/profile/:id" element={<UserProfile/>}/>
                <Route path="/current-match" element={<CurrentMatch/>}/>
                <Route path="/color-test" element={<ColorTest/>}/>
                <Route path="/" element={<Home/>}/>
            </Routes>
        </main>
    );
}

export default App;
