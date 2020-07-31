const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: 'canvasjs.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'canvasJS',
        libraryTarget: 'umd',
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        // Drop only console.logs but leave others
                        pure_funcs: ['console.log'],
                    },
                    mangle: {
                        // Note: I'm not certain this is needed.
                        reserved: ['console.log'],
                    },
                },
            }),
        ],
    },
    plugins: [new MiniCssExtractPlugin({
        filename: '[name].[hash].css',
        chunkFilename: '[id].[hash].css',
    })],
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                    outputPath: 'assets/images/',
                },
            },
            {
                test: /\.json5$/i,
                loader: 'json5-loader',
                type: 'javascript/auto',
                options: {
                    outputPath: 'assets/json/',
                },
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.(ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'assets/fonts/'
                }
            }
        ],
    },
};