import React from "react";
import User from "./User";

const UserList = ({users, ranking}) => {
    return (
        <div className={"max-w-7xl mx-auto mb-8 bg-white p-4 rounded rounded-lg shadow-lg"}>
            {ranking &&
            <h2 className={"text-center text-2xl"}>Leaderboard</h2>
            }

            <div
                className="grid grid-cols-5 text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                <span className={"px-4 py-3 col-span-3"}>Username</span>
                <span className={"px-4 py-3 text-right col-span-2"}>rating</span>
            </div>
            <div className="flex flex-col mb-5 text-gray-700 divide-y divide-black divide-solid">
                {users
                    .sort((a, b) => b.rating - a.rating)
                    .map((user, index) => (
                        <div
                            key={user.userId}
                            className={
                                "grid grid-cols-5 items-center bg-opacity-70 text-xs md:text-base" +
                                (index === 0 && ranking ? ' text-base md:text-xl bg-yellow-300' : '') +
                                (index === 1 && ranking ? ' text-sm md:text-lg bg-gray-300' : '') +
                                (index === 2 && ranking ? ' bg-yellow-600' : '')
                            }
                        >
                            <User user={user}/>
                        </div>
                    ))}
            </div>
        </div>
    )

};

export default UserList;