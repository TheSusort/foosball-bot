import axios from "axios";

export const serverUrl = 'http://localhost:5001/foosball-bot-1b613/us-central1/app/';

export const getUserData = async (userId) => {
    if (userId) {
        return  await axios.get(serverUrl + "getusers/?userid=" + userId).then((response) => {
            return response.data
        })
    }
    return await axios.get(serverUrl + "getusers").then((response) => {
        return response.data
    })
}
export const getGamesData = async () => {
    return await axios.get(serverUrl + "getgames").then((response) => {
        return response.data
    })
}