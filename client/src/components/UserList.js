import React, {useEffect} from "react";
import User from "./User";
import {useDispatch, useSelector} from "react-redux";
import {fetchUsers, selectAllUsers} from "../reducers/users";
import LoadingIndicator from "./LoadingIndicator";

const UserList = ({ranking}) => {
    const users = Object.values(useSelector(selectAllUsers))
    const dispatch = useDispatch();
    const usersStatus = useSelector(state => state.users.status)
    const usersError = useSelector(state => state.users.error)

    useEffect(() => {
        if (usersStatus === "idle") {
            dispatch(fetchUsers())
        }
    }, [dispatch, usersStatus])

    let content;

    if (usersStatus === "loading") {
        content = <LoadingIndicator loading={usersStatus === "loading"}/>
    } else if (usersStatus === "succeeded") {
        content = users
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
                    <User user={user} ranking={index}/>
                </div>
            ))
    } else if (usersStatus === "error") {
        content = <div>{usersError}</div>
    }

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
                {content}
            </div>
        </div>
    )

}


export default UserList;