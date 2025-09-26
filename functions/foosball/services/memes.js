const {pickRandomFromArray} = require("./helpers");
const axios = require("axios");

const getSpicyMeme = async () => {
    const result = await axios.get("https://meme-api.com/gimme/1").then((r) => r);
    return pickRandomFromArray(result.data.memes).url;
};

const getSpicyMemeAsImage = async () => {
    try {
        const result = await axios.get("https://meme-api.com/gimme/1").then((r) => r);
        const meme = pickRandomFromArray(result.data.memes);
        return [
            {
                "type": "image",
                "image_url": meme.url,
                "alt_text": meme.title || "Spicy meme"
            }
        ];
    } catch (error) {
        console.error("Error fetching meme:", error);
        return [];
    }
};

module.exports = {
    getSpicyMeme,
    getSpicyMemeAsImage,
};
