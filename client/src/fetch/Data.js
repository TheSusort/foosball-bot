import axios from "axios";

const serverUrl = {
    'live': 'https://us-central1-foosball-bot-1b613.cloudfunctions.net/app/',
    'test': 'http://localhost:5001/foosball-bot-1b613/us-central1/app/'
};

const env = 'live'

export const getUserData = async (userId) => {
    if (userId) {
        return await axios.get(serverUrl[env] + "getusers/?userid=" + userId).then((response) => {
            return response.data
        })
    }
    return await axios.get(serverUrl[env] + "getusers").then((response) => {
        return response.data
    })
}
export const getGamesData = async () => {
    return await axios.get(serverUrl[env] + "getgames").then((response) => {
        return response.data
    })
}

export const getCurrentScoreData = async () => {
    return await axios.get(serverUrl[env] + "getcurrentscore").then((response) => {
        return response.data
    })
}