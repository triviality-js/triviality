const path = require('path');
const nodeExternals = require("webpack-node-externals");
const NodemonPlugin = require("nodemon-webpack-plugin");

module.exports = {
    target: 'node',
    devtool: 'source-map',
    externals: [nodeExternals()],

    entry: './src/server/bootstrap.tsx',

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
                options: {
                    configFile: path.resolve(__dirname, 'tsconfig.webpack.json'),
                }
            }
        ]
    },
    resolve: {
        extensions: [ '.js', '.jsx', '.tsx', '.ts' ]
    },

    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'dist')
    },

    plugins: [
        new NodemonPlugin({
            /// Arguments to pass to the script being watched.
            args: ['server'],

            // Detailed log.
            verbose: true,

            // Node arguments.
            nodeArgs: ["--inspect=9222"],

            // If using more than one entry, you can specify
            // which output file will be restarted.
            script: "./dist/server.js",
        })
    ]
};
