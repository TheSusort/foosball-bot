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
            offset: Math.floor(Math.random() * 4999),
        });
        const randomGif = result.data[Math.floor(Math.random() * limit)];
        return randomGif.images.downsized.url;
    } catch (error) {
        console.error("search", error);
    }
};

module.exports = {
    gifSearch,
};
