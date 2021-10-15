import React from "react";
import {Link} from "react-router-dom";

const User = ({user}) => {
    return (
        <>
            <Link className={"px-4 py-3 overflow-ellipsis overflow-hidden"} to={`/profile/${user.userId}`}>{user.name}</Link>
            <p className={"px-4 py-3 text-right"}>{user.rating}</p>
        </>
    )
}

export default User