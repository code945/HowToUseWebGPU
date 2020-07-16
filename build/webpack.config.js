const path = require("path");
const Webpack = require("webpack");
const fs = require("fs");

// creates index.html file by a template index.ejs
const HtmlWebpackPlugin = require("html-webpack-plugin");
// cleans dist folder
const CleanWebpackPlugin = require("clean-webpack-plugin");
// copies the assets folder into dist folder
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const distFolder = "../dist";

const sections = fs.readdirSync(path.resolve(__dirname, "../src/demo"));

let entryPoints = {
    index: `./src/index.ts`,
};
let copyhtml = [
    new HtmlWebpackPlugin({
        title: "WebGPU知多少",
        filename: `index.html`,
        template: `src/index.ejs`,
        templateParameters: {
            items: sections,
        },
        chunks: ["index"],
        minify: {
            removeRedundantAttributes: true, // 删除多余的属性
            collapseWhitespace: true, // 折叠空白区域
            removeAttributeQuotes: true, // 移除属性的引号
            removeComments: true, // 移除注释
            collapseBooleanAttributes: true, // 省略只有 boolean 值的属性值 例如：readonly checked
        },
    }),
];

for (let i = 0; i < sections.length; i++) {
    var chunk = sections[i];
    entryPoints[chunk] = `./src/demo/${chunk}/page.ts`;
    copyhtml.push(
        new HtmlWebpackPlugin({
            title: "WebGPU学习-" + chunk,
            filename: `${chunk}.html`,
            template: `src/demo/${chunk}/page.html`,
            chunks: ["vendors", chunk],
            minify: {
                removeRedundantAttributes: true, // 删除多余的属性
                collapseWhitespace: true, // 折叠空白区域
                removeAttributeQuotes: true, // 移除属性的引号
                removeComments: true, // 移除注释
                collapseBooleanAttributes: true, // 省略只有 boolean 值的属性值 例如：readonly checked
            },
        })
    );
}

module.exports = {
    entry: entryPoints,
    output: {
        filename: "js/[name].[hash:5].js",
        path: path.resolve(__dirname, distFolder),
    },
    devtool: "inline-source-map",
    plugins: [
        require("autoprefixer"),
        new MiniCssExtractPlugin({
            filename: "css/[hash:5].css",
            options: {
                publicPath: "../../",
            },
        }),
        new Webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(
            distFolder
            //{ root: path.resolve(__dirname, '../')}
        ),
        // new CopyWebpackPlugin([
        //     {
        //         from: "src/static",
        //         to: "assets",
        //     },
        // ]),
        ...copyhtml,
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "../",
                        },
                    },
                    "css-loader?importLoaders=1",
                    "postcss-loader",
                ],
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "../",
                        },
                    },
                    "css-loader?importLoaders=1",
                    "postcss-loader",
                    "less-loader",
                ],
            },
            {
                test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
                use: "file-loader",
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: "file-loader",
                options: {
                    esModule: false,
                    name: "[name]_[hash:8].[ext]",
                    // publicPath: "assets/images",
                    outputPath: "./images", //定义输出的图片文件夹
                },
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".css", ".less"],
    },
    // target: "node",
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                },
            },
        },
    },
};
