import axios from "axios";

const serverUrl = {
    'production': import.meta.env.VITE_API_URL_LIVE,
    'development': import.meta.env.VITE_API_URL_TEST
};

const getCurrentEnv = () => import.meta.env.DEV ? 'development' : 'production';

export const getUserData = async () => {
    const env = getCurrentEnv();
    const url = serverUrl[env] + "getusers";

    return await axios.get(url).then((response) => {
        return response.data
    }).catch((error) => {
        console.error('Error fetching users:', error);
        throw error;
    })
}
export const getGamesData = async () => {
    const env = getCurrentEnv();
    const url = serverUrl[env] + "getgames";

    return await axios.get(url).then((response) => {
        return response.data
    }).catch((error) => {
        console.error('Error fetching games:', error);
        throw error;
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