const webpack = require("webpack");
const ModernizrWebpackPlugin = require("modernizr-webpack-plugin");
const modernizr_config = require("../../modernizr-config.json");

/*
------------------------------------------
| plugins:void (-)
|
| devPlugins:array
| prodPlugins:array
------------------------------------------ */
module.exports = {
  devPlugins: () => {
    let plugins = [
      new webpack.ProvidePlugin({
        _: "lodash"
      }),
      new webpack.ProvidePlugin({
        THREE: "three"
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: "commons",
        filename: "commons.js",
        minChunks: function(module){
          return module.context && module.context.includes("node_modules");
        }
      }),
      new ModernizrWebpackPlugin(modernizr_config),
      new webpack.NoEmitOnErrorsPlugin()
    ];
    return plugins;
  },
  prodPlugins: () => {
    let plugins = [
      new webpack.ProvidePlugin({
        _: "lodash"
      }),
      new webpack.ProvidePlugin({
        THREE: "three"
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: "commons",
        filename: "commons.js",
        minChunks: function(module){
          return module.context && module.context.includes("node_modules");
        }
      }),
      new ModernizrWebpackPlugin(modernizr_config),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
      })
    ];
    return plugins;
  }
};
