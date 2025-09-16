import {Route, Routes} from "react-router-dom";
import Home from "./components/Home.jsx";
import UserProfile from "./components/UserProfile.jsx";
import React from "react";
import CurrentMatch from "./components/CurrentMatch.jsx";

function App() {

    return (
        <main>
            <Routes>
                <Route path="/profile/:id" element={<UserProfile/>}/>
                <Route path="/current-match" element={<CurrentMatch/>}/>
                <Route path="/" element={<Home/>}/>
            </Routes>
        </main>
    );
}

export default App;
