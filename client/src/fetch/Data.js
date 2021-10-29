import axios from "axios";

const serverUrl = {
    'production': process.env.REACT_APP_API_URL_LIVE,
    'development': process.env.REACT_APP_API_URL_TEST
};

console.log(process.env.NODE_ENV)

export const getUserData = async () => {
    return await axios.get(serverUrl[process.env.NODE_ENV] + "getusers").then((response) => {
        return response.data
    })
}
export const getGamesData = async () => {
    return await axios.get(serverUrl[process.env.NODE_ENV] + "getgames").then((response) => {
        return response.data
    })
}

export const getCurrentScoreData = async () => {
    return await axios.get(serverUrl[process.env.NODE_ENV] + "getcurrentscore").then((response) => {
        return response.data
    })
}

export const getEmojisData = async () => {
    return await axios.get(serverUrl[process.env.NODE_ENV] + "getemojis").then((response) => {
        return response.data.emoji
    })
}