import React from "react";

const UserList = ({users, removeData}) => {

    return (
        <>
            <h2>Leder</h2>
            <div className="grid grid-cols-5">
                <span>Username</span>
                <span>rating</span>
                <span>wins</span>
                <span>Total games</span>
                <span>Remove user</span>
            </div>
            <div className="flex flex-col my-5">
                {users
                    .sort((a, b) => b.rating - a.rating)
                    .map(user => (
                    <div
                        key={user.name}
                        className="grid grid-cols-5"
                    >

                        <p>{user.name}</p>
                        <p>{user.rating}</p>
                        <p>{user.wins}</p>
                        <p>{user.totalGames}</p>
                        <button
                            onClick={() => removeData(user)}
                            className="text-left"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </>
    )
};

export default UserList;