const path = require('path');

module.exports = {

    entry: './src/index.ts',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
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