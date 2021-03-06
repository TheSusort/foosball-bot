import React from "react";
import {Link} from "react-router-dom";
import UserName from "./UserName";

const User = ({user, ranking, sortBy = "rating"}) => {
    let size;
    if (ranking === 0) {
        size = "h-5 md:h-6"
    } else if (ranking === 1) {
        size = "h-4 md:h-5"
    } else if (ranking) {
        size = "h-3.5 md:h-5"
    }

    return (
        <>
            <Link className={"px-4 py-3 overflow-ellipsis overflow-hidden col-span-3"}
                  to={`/profile/${user.userId}`}>
                <UserName user={user} size={size}/>
            </Link>
            <p className={"px-4 py-3 text-right col-span-2"}>{Math.round(user[sortBy] ?? 0)}</p>
        </>
    )
}

export default User