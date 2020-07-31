const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'canvasjs.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'canvasJS',
        libraryTarget: 'umd',
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        })
    ],
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
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: true,
                            reloadAll: true,
                        }
                    }, 
                    'css-loader'
                ]
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