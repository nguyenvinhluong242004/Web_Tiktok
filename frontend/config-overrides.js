const webpack = require("webpack");

module.exports = function override(config, env) {
  config.resolve.fallback = {
    "assert": require.resolve("assert/"),
    "url": require.resolve("url/"),
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "os": require.resolve("os-browserify/browser"),
    "buffer": require.resolve("buffer/")
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);

  return config;
};
