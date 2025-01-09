const webpack = require("webpack");

module.exports = {
  experiments: {
    topLevelAwait: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      FETCHER_HOST: JSON.stringify(
        process.env.FETCHER_HOST ?? "http://localhost"
      ),
      FETCHER_PORT: JSON.stringify(process.env.FETCHER_PORT ?? "4000"),
    }),
  ],
};
