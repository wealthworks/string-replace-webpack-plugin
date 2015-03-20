var webpack = require("webpack");
var StringReplacePlugin = require("../");
var secrets = require('./client_secret.json');

module.exports = {
	entry: {
        index: "./index.html",
		a: "./entry.js",
		b: "./entry2.js"
	},
	output: {
		filename: "[name].js?[hash]-[chunkhash]",
		chunkFilename: "[name].js?[hash]-[chunkhash]",
		path: __dirname + "/assets",
		publicPath: "/assets/"
	},
	module: {
		loaders: [
			{ test: /\.css$/, loader: "style-loader!css-loader?sourceMap"},
			{ test: /\.png$/, loader: "file-loader" },
            { test: /\.html$/,    loader: "file?name=[path][name].[ext]" }, // copies the files over
            { test: /index.html$/, loader: StringReplacePlugin.replace({
                replacements: [
                    {
                        pattern: /<!-- @secret (\w*?) -->/ig,
                        replacement: function (match, p1, offset, string) {
                            return secrets.web[p1];
                        }
                    }
                ]})
            },
		]
	},
	devtool: "sourcemap",
	plugins: [
		new StringReplacePlugin(),
		new webpack.optimize.CommonsChunkPlugin("c", "c.js")
	]
};