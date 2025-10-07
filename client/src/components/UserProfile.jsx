import React, {useEffect, useState, useRef} from "react";
import {useParams} from "react-router-dom";
import GameList from "./GameList";
import DetailedUser from "./DetailedUser";
import {CSSTransition} from "react-transition-group";
import LoadingIndicator from "./LoadingIndicator";
import {useSelector} from "react-redux";
import {selectUserById} from "../reducers/users";

const UserProfile = () => {
    let {id} = useParams()
    const [loading, setLoading] = useState(true);
    const user = useSelector(state => selectUserById(state, id))
    const nodeRef = useRef(null);

    useEffect(() => {
        setLoading(true)
        setTimeout(() => setLoading(false), 1000)
    }, [id])

    return (
        <>
            <LoadingIndicator loading={loading}/>
            <CSSTransition
                key={"profile"}
                in={!loading}
                timeout={500}
                classNames="fade"
                unmountOnExit
                nodeRef={nodeRef}
            >
                <div ref={nodeRef} className="container mx-auto p-4 ">
                    <div className="text-center my-5 relative">
                        <h1 className="stripe-text stripe-text--color-burn">slæckball 3000</h1>
                        <div className="stripe-text stripe-text--overlay">slæckball 3000</div>
                    </div>
                    <DetailedUser {...user} />
                    <GameList filter={id}/>

                </div>
            </CSSTransition>
        </>
    )
}

export default UserProfile