import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";

const UserList = (props) => {
    const [user, setUser] = useState(props);


    useEffect(() => {
        setUser(props)
    },[props])

    if (user) {
        return (
            <div className={"max-w-7xl mx-auto mb-8 bg-white p-4 rounded rounded-lg shadow-lg relative"}>
                <Link className={"absolute left-4"} to={"/"} >Back</Link>
                <h2 className={"text-center text-2xl"}>{user.name}</h2>

                <div className="flex border-t border-gray-600">
                    <div className="flex flex-col text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-r border-gray-600">
                        <span className={"px-4 py-3 border-b border-gray-600"} >Username</span>
                        <span className={"px-4 py-3 border-b border-gray-600"} >User ID</span>
                        <span className={"px-4 py-3 border-b border-gray-600"} >rating</span>
                        <span className={"px-4 py-3 border-b border-gray-600"} >wins</span>
                        <span className={"px-4 py-3"} >Total games</span>
                    </div>
                    <div className="flex flex-col flex-1 text-gray-700 divide-y divide-black divide-solid">
                        <p className={"px-4 py-3 overflow-ellipsis overflow-hidden"}>{user.name}</p>
                        <p className={"px-4 py-3"}>{user.userId}</p>
                        <p className={"px-4 py-3"}>{user.rating}</p>
                        <p className={"px-4 py-3"}>{user.wins}</p>
                        <p className={"px-4 py-3"}>{user.totalGames}</p>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <>
            <div className={"max-w-4xl mx-auto mb-8 bg-white p-4 rounded rounded-lg shadow-lg relative"}>
                <div className="loader text-center">loading user</div>
            </div>
        </>
    )
};

export default UserList;