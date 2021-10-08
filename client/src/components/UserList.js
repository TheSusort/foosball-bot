import React from "react";
import User from "./User";

const UserList = ({users, isLoaded}) => {
    if (isLoaded) {
        return (
            <>
                <h2 className={""}>Leaderboard</h2>
                <div className="grid grid-cols-4">
                    <span>Username</span>
                    <span>rating</span>
                    <span>wins</span>
                    <span>Total games</span>
                </div>
                <div className="flex flex-col my-5">
                    {users
                        .sort((a, b) => b.rating - a.rating)
                        .map(user => (
                            <div
                                key={user.userId}
                                className="grid grid-cols-4"
                            >
                                <User user={user}/>
                            </div>
                    ))}
                </div>
            </>
        )
    }
    return (
        <>
            <div className="loader">loading users</div>
        </>
    )
};

export default UserList;