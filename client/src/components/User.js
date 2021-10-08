import React from "react";

const User = ({user}) => {
    return (
        <>
            <p className={"px-4 py-3 overflow-ellipsis overflow-hidden"}>{user.name}</p>
            <p className={"px-4 py-3"}>{user.rating}</p>
            <p className={"px-4 py-3"}>{user.wins}</p>
            <p className={"px-4 py-3"}>{user.totalGames}</p>
        </>
    )
}

export default User