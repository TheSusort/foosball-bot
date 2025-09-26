require("isomorphic-fetch");
const {GiphyFetch} = require("@giphy/js-fetch-api");
const {GIPHY_API_KEY} = require("../../config");
const gf = new GiphyFetch(GIPHY_API_KEY);

const gifSearch = async (term) => {
    try {
        const limit = 50;
        const result = await gf.search(term, {
            sort: "relevant",
            limit: limit,
        });
        if (result.data.length) {
            const randomGif = result.data[Math.floor(Math.random() * limit)];
            return randomGif.images.downsized.url;
        }
        return "";
    } catch (error) {
        console.error("search", error);
    }
};

const gifSearchAsImage = async (term) => {
    try {
        const limit = 50;
        const result = await gf.search(term, {
            sort: "relevant",
            limit: limit,
        });
        if (result.data.length) {
            const randomGif = result.data[Math.floor(Math.random() * limit)];
            return [
                {
                    "type": "image",
                    "image_url": randomGif.images.downsized.url,
                    "alt_text": term
                }
            ];
        }
        return [];
    } catch (error) {
        console.error("search", error);
        return [];
    }
};

module.exports = {
    gifSearch,
    gifSearchAsImage,
};
