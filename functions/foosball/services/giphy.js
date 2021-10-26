require("isomorphic-fetch");
const {GiphyFetch} = require("@giphy/js-fetch-api");
const {GIPHY_API_KEY} = require("../../config");
const gf = new GiphyFetch(GIPHY_API_KEY);

const gifSearch = async (term) => {
    try {
        const limit = 25;
        let onlyBigGifs = true;
        const result = await gf.search(term, {sort: "relevant", limit: limit});
        while (onlyBigGifs) {
            const randomGif = result.data[Math.floor(Math.random() * limit)];
            if (randomGif.images.original.size < 3000000) {
                onlyBigGifs = false;
                return randomGif.bitly_url;
            }
        }
    } catch (error) {
        console.error("search", error);
    }
};

module.exports = {
    gifSearch,
};
