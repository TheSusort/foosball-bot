import React from "react";
import User from "./User";

const UserList = ({users, isLoaded}) => {
    if (isLoaded) {
        return (
            <div className={"max-w-4xl mx-auto mb-8 bg-white p-4 rounded rounded-lg shadow-lg"}>
                <h2 className={"text-center text-2xl"}>Leaderboard</h2>
                <div className="grid grid-cols-4 text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                    <span className={"px-4 py-3"} >Username</span>
                    <span className={"px-4 py-3"} >rating</span>
                    <span className={"px-4 py-3"} >wins</span>
                    <span className={"px-4 py-3"} >Total games</span>
                </div>
                <div className="flex flex-col mb-5 text-gray-700 divide-y divide-black divide-solid">
                    {users
                        .sort((a, b) => b.rating - a.rating)
                        .map((user, index) => (
                            <div
                                key={user.userId}
                                className={
                                    "grid grid-cols-4 items-center bg-opacity-70" +
                                    (index === 0 ? ' text-xl bg-yellow-300' : '') +
                                    (index === 1 ? ' text-lg bg-gray-300' : '') +
                                    (index === 2 ? ' bg-yellow-600' : '')
                                }
                            >
                                <User user={user}/>
                            </div>
                    ))}
                </div>
            </div>
        )
    }
    return (
        <>
            <div className="loader text-center">loading users</div>
        </>
    )
};

export default UserList;