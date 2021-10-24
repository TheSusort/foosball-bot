import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getEmojisData} from "../fetch/Data";

export const fetchEmojis = createAsyncThunk('emojis/fetchEmojis', async () => {
    return await getEmojisData()
})

export const emojisSlice = createSlice({
    name: "emojis",
    initialState: {
        emojis: {},
        status: "idle",
        error: null
    },
    reducers: {
        emojisAdded: {
            reducer(state, action) {
                state.push(action.payload)
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchEmojis.pending, (state, action) => {
                state.status = "loading"
            })
            .addCase(fetchEmojis.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.emojis = action.payload
            })
            .addCase(fetchEmojis.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.error.message
            })
    }
})

export const {emojisAdded} = emojisSlice.actions;

export default emojisSlice.reducer;

export const selectAllEmojis = state => state.emojis.emojis