import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getUserData} from "../fetch/Data";

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    return await getUserData()
})

export const usersSlice = createSlice({
    name: "users",
    initialState: {
        users: [],
        status: "idle",
        error: null
    },
    reducers: {
        usersAdded: {
            reducer(state, action) {
                state.push(action.payload)
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchUsers.pending, (state, action) => {
                state.status = "loading"
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.users = action.payload
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.error.message
            })
    }
})

export const {usersAdded} = usersSlice.actions

export default usersSlice.reducer

export const selectAllUsers = state => state.users.users

export const selectUserById = (state, userId) => {
    return state.users.users[userId]
}
