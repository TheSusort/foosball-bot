import React from "react";
import UserList from "./UserList";
import GameList from "./GameList";

const Home = ({users, games}) => {


    return (
        <React.Fragment>
            <div className="container mx-auto p-4 ">
                <div className="text-center my-5">
                    <h1 className="text-4xl">Slæckball 3000</h1>
                </div>
                <UserList users={Object.values(users)} ranking={true}/>
                <GameList games={games} users={users}/>
            </div>
        </React.Fragment>
    )
}

export default Home;