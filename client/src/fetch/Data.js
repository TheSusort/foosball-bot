import axios from "axios";

const serverUrl = {
    'production': import.meta.env.VITE_API_URL_LIVE,
    'development': import.meta.env.VITE_API_URL_TEST
};

const getCurrentEnv = () => import.meta.env.VITE_DEV ? 'development' : 'production';

export const getUserData = async () => {
    return await axios.get(serverUrl[getCurrentEnv()] + "getusers").then((response) => {
        return response.data
    })
}
export const getGamesData = async () => {
    return await axios.get(serverUrl[getCurrentEnv()] + "getgames").then((response) => {
        return response.data
    })
}

export const getCurrentScoreData = async () => {
    return await axios.get(serverUrl[getCurrentEnv()] + "getcurrentscore").then((response) => {
        return response.data
    })
}

export const getEmojisData = async () => {
    return await axios.get(serverUrl[getCurrentEnv()] + "getemojis").then((response) => {
        return response.data.emoji
    })
}