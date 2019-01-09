const path = require('path');
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");

module.exports = {
    entry: {
        client: './src/client/bootstrap.tsx'
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
                options: {
                    configFile: path.resolve(__dirname, 'tsconfig.webpack.json'),
                }
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS, using Node Sass by default
                ]
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    node: {
        fs: 'empty',
        module: 'empty'
    },

    output: {
        path: path.resolve(__dirname, 'dist', 'client'),
    },

    plugins: [
        new BrowserSyncPlugin({
            proxy: "http://localhost:3000",
            notify: true,
            https: false,
            port: 4000,
        })
    ],

    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    enforce: true,
                    chunks: 'all'
                }
            }
        },
    }
};
