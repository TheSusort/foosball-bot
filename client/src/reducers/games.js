import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getGamesData} from "../fetch/Data";

export const fetchGames = createAsyncThunk('games/fetchGames', async () => {
    return await getGamesData()
})

export const gamesSlice = createSlice({
    name: "games",
    initialState: {
        games: [],
        status: "idle",
        error: null
    },
    reducers: {
        gamesAdded: {
            reducer(state, action) {
                state.push(action.payload)
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchGames.pending, (state, action) => {
                state.status = "loading"
            })
            .addCase(fetchGames.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.games = action.payload
            })
            .addCase(fetchGames.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.error.message
            })
    }
})

export const {gamesAdded} = gamesSlice.actions;

export default gamesSlice.reducer;

export const selectAllGames = state => state.games.games