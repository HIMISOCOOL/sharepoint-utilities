const baseConfig = require('./webpack.config');
module.exports = {
    ...baseConfig,
    output: {
        filename: 'sharepoint-utilities.js'
    },
    optimization: {
        minimize: false
    }
};
