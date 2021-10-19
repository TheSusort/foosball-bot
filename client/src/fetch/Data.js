import axios from "axios";

export const serverUrl = 'https://us-central1-foosball-bot-1b613.cloudfunctions.net/app/';

export const getUserData = async (userId) => {
    if (userId) {
        return await axios.get(serverUrl + "getusers/?userid=" + userId).then((response) => {
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