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
      EXPERIMENTS_BACKEND_API_ENDPOINT: JSON.stringify(
        process.env.EXPERIMENTS_BACKEND_API_ENDPOINT ??
          "http://localhost:3003/api/experiments"
      ),
    }),
  ],
};
