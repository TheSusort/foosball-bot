import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import UserName from "./UserName";

const UserList = (props) => {
    const [user, setUser] = useState(props);

    useEffect(() => {
        setUser(props)
    }, [props])

    if (user) {
        let exp = 0;
        if (user.exp) {
            for (const expType in user.exp) {
                exp += user.exp[expType]
            }
        }

        return (
            <div className={"max-w-7xl mx-auto mb-8 bg-white p-4 rounded rounded-lg shadow-lg relative"}>
                <Link className={"absolute left-4 text-xs md:text-base"} to={"/"}>Back</Link>
                <h2 className={"text-center text-sm md:text-2xl name pt-5 w-full flex justify-center"}>
                    <UserName user={user} size={"h-4 md:h-7"}/>
                </h2>

                <div className="flex border-t border-gray-600 text-xs md:text-base overflow-x-auto">
                    <div
                        className="flex flex-col text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-r border-gray-600">
                        <span className={"compact-grid-cell border-b border-gray-600"}>Username</span>
                        <span className={"compact-grid-cell border-b border-gray-600"}>User ID</span>
                        <span className={"compact-grid-cell border-b border-gray-600"}>rating</span>
                        <span className={"compact-grid-cell border-b border-gray-600"}>wins</span>
                        <span className={"compact-grid-cell border-b border-gray-600"}>Total games</span>
                        <span className={"compact-grid-cell"}>Exp</span>
                    </div>
                    <div className="flex flex-col flex-1 text-gray-700 divide-y divide-black divide-solid">
                        <p className={"compact-grid-cell name"}>
                            <UserName user={user} size={"h-3.5 md:h-5"}/>
                        </p>
                        <p className={"compact-grid-cell"}>{user.userId}</p>
                        <p className={"compact-grid-cell"}>{user.rating}</p>
                        <p className={"compact-grid-cell"}>{user.wins}</p>
                        <p className={"compact-grid-cell"}>{user.totalGames}</p>
                        <p className={"compact-grid-cell"}>{exp}</p>
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