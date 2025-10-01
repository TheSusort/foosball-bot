import React, {useRef} from "react";
import {useSelector} from "react-redux";
import UserList from "./UserList";
import GameList from "./GameList";
import LoadingIndicator from "./LoadingIndicator";
import {CSSTransition} from "react-transition-group";

const Home = () => {
    const nodeRef = useRef(null);

    // Get loading states from Redux
    const usersStatus = useSelector(state => state.users.status);
    const gamesStatus = useSelector(state => state.games.status);
    const emojisStatus = useSelector(state => state.emojis.status);

    // Get error states
    const usersError = useSelector(state => state.users.error);
    const gamesError = useSelector(state => state.games.error);
    const emojisError = useSelector(state => state.emojis.error);

    // Show loading if any of the data is still loading
    const loading = usersStatus === 'loading' || gamesStatus === 'loading' || emojisStatus === 'loading';

    // Check if any data fetching failed
    const hasError = usersStatus === 'failed' || gamesStatus === 'failed' || emojisStatus === 'failed';

    return (
        <>
            <LoadingIndicator loading={loading}/>
            <CSSTransition
                key={"content"}
                in={!loading}
                timeout={300}
                classNames="fade"
                unmountOnExit
                nodeRef={nodeRef}
            >
                <div ref={nodeRef} className="container mx-auto p-4 max-w-7xl">
                    <div className="text-center my-5 relative">
                        <h1 className="stripe-text stripe-text--color-burn">slæckball 3000</h1>
                        <div className="stripe-text stripe-text--overlay">slæckball 3000</div>
                    </div>

                    {hasError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            <strong className="font-bold">Error loading data:</strong>
                            <ul className="mt-2">
                                {usersStatus === 'failed' && <li>Users: {usersError}</li>}
                                {gamesStatus === 'failed' && <li>Games: {gamesError}</li>}
                                {emojisStatus === 'failed' && <li>Emojis: {emojisError}</li>}
                            </ul>
                        </div>
                    )}

                    <div className="max-w-7xl mx-auto flex flex-wrap flex-col md:flex-row">
                        <UserList ranking={true} title={"Fussball rankings"}/>
                        <UserList ranking={true} title={"Biggest wallets"} sortBy={"coins"}/>
                    </div>
                    <GameList/>
                </div>
            </CSSTransition>
        </>
    )
}

export default Home;