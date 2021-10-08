import React from "react";

const User = ({user}) => {
    return (
        <>
            <p>{user.name}</p>
            <p>{user.rating}</p>
            <p>{user.wins}</p>
            <p>{user.totalGames}</p>
        </>
    )
}

export default User