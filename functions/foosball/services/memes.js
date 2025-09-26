const {pickRandomFromArray} = require("./helpers");
const axios = require("axios");

const getSpicyMeme = async () => {
    const result = await axios.get("https://meme-api.com/gimme/1").then((r) => r);
    return pickRandomFromArray(result.data.memes).url;
};

module.exports = {
    getSpicyMeme,
};
