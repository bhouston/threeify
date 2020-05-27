const path = require('path');

module.exports = {

    entry: './src/index.ts',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },

    devtool: 'source-map',
    devServer: {
        contentBase: './dist',
    },

   module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },

    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
};