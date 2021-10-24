import React, {useEffect, useState} from "react";
import UserList from "./UserList";
import GameList from "./GameList";
import LoadingIndicator from "./LoadingIndicator";
import {CSSTransition} from "react-transition-group";

const Home = () => {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 500)
    }, [])

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
                    <UserList ranking={true}/>
                    <GameList/>
                </div>
            </CSSTransition>
        </>
    )
}

export default Home;