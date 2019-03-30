const path = require("path");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const fs = require("fs-extra");
const Visualizer = require("webpack-visualizer-plugin");
const Encore = require("@symfony/webpack-encore");
const exists = (source) => fs.existsSync(source);
const isDirectory = (source) => exists(source) && fs.lstatSync(source).isDirectory();
const hasClientDirectory = (source) => isDirectory(path.join(source, "src", "client"));
const getDirectories = (source) => fs.readdirSync(source)
    .map((name) => path.join(__dirname, "packages", name))
    .filter(isDirectory)
    .filter(hasClientDirectory);

module.exports = getDirectories("packages")
    .map((directory) => {
        const packageName = path.dirname(directory);
        Encore.reset();
        const config = Encore
            .setOutputPath(path.resolve(directory, "dist", "client"))
            .setPublicPath("/")
            .addEntry("client", path.join(directory, "src", "client", "bootstrap.tsx"))
            .addStyleEntry("style", path.join(directory, "style", "style.scss"))
            .enableSingleRuntimeChunk()
            .cleanupOutputBeforeBuild()
            .enableSourceMaps(!Encore.isProduction())
            .enableTypeScriptLoader()
            .enableSassLoader()
            .addPlugin(new Visualizer())
            .addPlugin(new BrowserSyncPlugin({
                proxy: "http://localhost:3000",
                notify: true,
                https: false,
                port: 4000,
            }))
            .getWebpackConfig();

        config.name = packageName;

        return config;
    });
