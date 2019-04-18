const autoprefixer = require("autoprefixer");
const CheckerPlugin = require("fork-ts-checker-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const url = require("url");
const webpack = require("webpack");
const BundleTracker = require("webpack-bundle-tracker");

const resolve = path.resolve.bind(path, __dirname);

const bundleTrackerPlugin = new BundleTracker({
  filename: "webpack-bundle.json"
});

const checkerPlugin = new CheckerPlugin({
  reportFiles: ["app/**/*.{ts,jsx}"],
  tslint: true
});

module.exports = (env, argv) => {
  const devMode = argv.mode !== 'production';

  let extractCssPlugin;
  let fileLoaderPath;
  let output;

  if (!devMode) {
    const baseStaticPath = process.env.STATIC_URL || "/app/";
    const publicPath = url.resolve(baseStaticPath, "bundles/");
    output = {
      path: resolve("bundles/"),
      filename: "[name].[chunkhash].js",
      chunkFilename: "[name].[chunkhash].js",
      publicPath: publicPath
    };
    fileLoaderPath = "file-loader?name=[name].[hash].[ext]";
    extractCssPlugin = new MiniCssExtractPlugin({
      filename: "[name].[chunkhash].css",
      chunkFilename: "[id].[chunkhash].css"
    });
  } else {
    output = {
      path: resolve("bundles/"),
      filename: "[name].js",
      chunkFilename: "[name].js",
      publicPath: "/bundles/"
    };
    fileLoaderPath = "file-loader?name=[name].[ext]";
    extractCssPlugin = new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[name].css"
    });
  }

  return {
    entry: {
      bundle: "./app/app.jsx"
    },
    output: output,
    module: {
      rules: [
        {
          test: /\.(js|jsx|tsx|ts)$/,
          exclude: path.resolve(__dirname, "node_modules"),
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript"
              ],
              plugins: [
                ["@babel/plugin-proposal-decorators", { legacy: true }],
                "@babel/plugin-syntax-dynamic-import",
                ["@babel/plugin-proposal-class-properties", { loose: true }]
              ]
            }
          }
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                sourceMap: false
              }
            },
            {
              loader: "postcss-loader",
              options: {
                sourceMap: false,
                plugins: function() {
                  return [autoprefixer];
                }
              }
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: false
              }
            }
          ]
        },
        {
          test: /\.(eot|otf|png|svg|jpg|ttf|woff|woff2)(\?v=[0-9.]+)?$/,
          loader: fileLoaderPath,
          include: [
            resolve("node_modules")
          ]
        }
      ]
    },
    optimization: {
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false
    },
    plugins: [
      bundleTrackerPlugin,
      extractCssPlugin,
      checkerPlugin,
    ],
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"]
    }
    // devtool: 'sourceMap'
  };
};
