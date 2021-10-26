require("isomorphic-fetch");
const {GiphyFetch} = require("@giphy/js-fetch-api");
const {GIPHY_API_KEY} = require("../../config");
const gf = new GiphyFetch(GIPHY_API_KEY);

const gifSearch = async (term) => {
    try {
        const limit = 25;
        const result = await gf.search(term, {sort: "relevant", limit: limit});
        const randomGif = result.data[Math.floor(Math.random() * limit)];
        return randomGif.images.downsized.url;
    } catch (error) {
        console.error("search", error);
    }
};

module.exports = {
    gifSearch,
};
