const path = require('path');

var babelLoader = {
    loader: 'babel-loader',
    options: {
        cacheDirectory: true
    }
};

module.exports = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'sharepoint-utilities.js',
        libraryExport: 'default',
        library: 'sharepointUtilities'
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                exclude: /node_modules/,
                use: [
                    babelLoader,
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [babelLoader]
            }
        ]
    }
};
