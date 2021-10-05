import React, {useEffect, useRef, useState} from "react";
import {db} from "./firebase";
import UserList from "./components/UserList";
import GameList from "./components/GameList";

function App() {

    const [playerOne, setPlayerOne] = useState('');
    const [playerTwo, setPlayerTwo] = useState('');
    const [playerThree, setPlayerThree] = useState('');
    const [playerFour, setPlayerFour] = useState('');

    const [resultOne, setResultOne] = useState('');
    const [resultTwo, setResultTwo] = useState('');

    const [state, setState] = useState({users: [], games: []})

    const isInitialMount = useRef(true);


    useEffect(() => {
        if (isInitialMount.current) {
            getUserData()
            isInitialMount.current = false;
        } else {
            writeUserData()
        }
    });

    const writeUserData = () => {
        db
            .ref("/")
            .set(state);
    };

    const getUserData = () => {
        let ref = db.ref("/");
        ref.on("value", snapshot => {
            setState(snapshot.val());
        });
    };

    const handleSubmit = event => {
        event.preventDefault();
        const {users, games} = state;

        const winningScore = 10;

        // update users
        let teams = [
            {
                players: [
                    getUser(playerOne.trim()),
                    getUser(playerTwo.trim() === "" ? playerOne.trim() : playerTwo)
                ],
                resultValue: Number(resultOne)
            },

            {
                players: [
                    getUser(playerThree.trim()),
                    getUser(playerFour.trim() === "" ? playerThree.trim() : playerFour)
                ],
                resultValue: Number(resultTwo)
            }
        ];

        // calculate combined ratings

        teams.map(team => {
            console.log(team)
            team.combinedRating = 0;
            team.players.map((player) => {
                team.combinedRating += player.rating;
                return player;
            })

            team.combinedRating = team.combinedRating / team.players.length;
            console.log("combined rating: ",team.combinedRating)
            return team;
        })

        /**
         * new ratings
         * 1. get new combined rating
         * 2. delta of combined rating is delta for each players new rating
         */

        teams.map((team, index) => {
            team.didWin = team.resultValue >= winningScore ? 1 : 0;
            let newCombinedRating = calculateNewRating(team.combinedRating, teams[Number(!index)].combinedRating, team.didWin)
            team.newDeltaRating = newCombinedRating - team.combinedRating;
            return team;
        })

        teams.map(team => {
            team.players.map(player => {

                console.log(player.name, team.didWin, team.newDeltaRating)
                updateUser(player.name, team.didWin, team.newDeltaRating);
                return player;
            })
            return team;
        })

        // create game in games

        const uid = new Date().getTime().toString();


        games.push({
            uid,
            team1: playerOne + ' / ' + playerTwo,
            team2: playerThree + ' / ' + playerFour,
            result: resultOne + ' - ' + resultTwo,
            delta: teams[0].newDeltaRating
        });
        setState({users, games});
    };

    const getUser = (name) => {
        const {users} = state;
        const userIndex = users.findIndex(data => {
            return data.name === name;
        });

        if (userIndex !== -1) {
            return users[userIndex];
        } else {
            return createUser(name)
        }
    }


    const createUser = (name) => {
        const {users, games} = state;

        users.push({name, wins: 0, totalGames: 1, rating: 1000});
        setState({users, games});
        return users[users.length - 1]
    }

    const updateUser = (name, win, newDeltaRating) => {
        const {users, games} = state;
        const userIndex = users.findIndex(data => {
            return data.name === name;
        });

        if (userIndex !== -1) {
            users[userIndex].wins += win;
            users[userIndex].rating += newDeltaRating;
            users[userIndex].totalGames++;
        }
        setState({users, games});
    }

    const calculateNewRating = (rating, oppRating, result) => {
        const ratio = (oppRating - rating) / 400;
        const expectedScore = 1 / (1 + (10 ** ratio));
        return Math.round(rating + (40 * (result - expectedScore)));
    }

    const removeData = user => {
        const {users, games} = state;
        const newState = users.filter(data => {
            return data.name !== user.name;
        });
        setState({users: newState, games});
    };

    return (
        <React.Fragment>
            <div className="container mx-auto p-4">
                <div className="text-center">
                    <h1 className="text-2xl">Slæckball</h1>
                </div>

                <div className="">
                    <div className="">
                        <h1>Add new game</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="">
                                <div className="">
                                    <label>team 1 / player 1</label>
                                    <input
                                        type="text"
                                        className=""
                                        placeholder="player"
                                        onChange={e => setPlayerOne(e.target.value)}
                                    />
                                </div>
                                <div className="">
                                    <label>team 1 / player 2</label>
                                    <input
                                        type="text"
                                        className=""
                                        placeholder="player"
                                        onChange={e => setPlayerTwo(e.target.value)}
                                    />
                                </div>
                                <div className="">
                                    <label>team 2 / player 1</label>
                                    <input
                                        type="text"
                                        className=""
                                        placeholder="player"
                                        onChange={e => setPlayerThree(e.target.value)}
                                    />
                                </div>
                                <div className="">
                                    <label>team 2 / player 2</label>
                                    <input
                                        type="text"
                                        className=""
                                        placeholder="player"
                                        onChange={e => setPlayerFour(e.target.value)}
                                    />
                                </div>
                                <div className="">
                                    <label>result team 1</label>
                                    <input
                                        type="number"
                                        className=""
                                        placeholder="number"
                                        onChange={e => setResultOne(e.target.value)}
                                    />
                                </div>
                                <div className="">
                                    <label>result team 2</label>
                                    <input
                                        type="number"
                                        className=""
                                        placeholder="number"
                                        onChange={e => setResultTwo(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Save
                            </button>
                        </form>
                    </div>
                </div>
                <UserList users={state.users} removeData={removeData}/>
                <GameList games={state.games}/>
            </div>
        </React.Fragment>
    );
}

export default App;
