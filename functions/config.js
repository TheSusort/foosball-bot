const dotenv = require("dotenv");
const result = dotenv.config();
if (result.error) {
    throw result.error;
}

const parsedResult = Object.keys(result.parsed).reduce((object, key) => {
    if (Number(result.parsed.DEVELOPMENT_MODE)) {
        if (key.indexOf("_TEST") !== -1 ||
            key.indexOf("MODE") !== -1 ||
            key.indexOf("FIREBASE") !== -1
        ) {
            if (key.indexOf("_TEST") !== -1) {
                const strIndex = key.indexOf("_TEST");
                const newKey = key.substr(0, strIndex);
                object[newKey] = result.parsed[key];
                return object;
            }
        }
    }
    object[key] = result.parsed[key];
    return object;
}, {});

module.exports = parsedResult;
