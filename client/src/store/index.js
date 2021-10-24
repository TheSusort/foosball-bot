import {configureStore} from '@reduxjs/toolkit'

import usersReducer from '../reducers/users'
import gamesReducer from '../reducers/games'
import emojisReducer from "../reducers/emojis";

export default configureStore({
    reducer: {
        users: usersReducer,
        games: gamesReducer,
        emojis: emojisReducer
    }
})