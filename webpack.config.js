const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    background: path.resolve(__dirname + "/src/background.js"),
    content: path.resolve(__dirname + "/src/content.js"),
    detector: path.resolve(__dirname + "/src/detector.js"),
    devtools: path.resolve(__dirname + "/src/devtools.js"),
    panel: path.resolve(__dirname + "/src/panel.js")
  },
  output: {
    path: path.resolve(__dirname + "/dist/")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins: [
    new CopyPlugin([
      {
        from: path.resolve(__dirname + "/src/icons"),
        to: path.resolve(__dirname + "/dist/icons/")
      },
      {
        from: path.resolve(__dirname + "/src/manifest.json"),
        to: path.resolve(__dirname + "/dist/manifest.json")
      },
      {
        from: path.resolve(__dirname + "/src/devtools.html"),
        to: path.resolve(__dirname + "/dist/")
      },
      {
        from: path.resolve(__dirname + "/src/panel.html"),
        to: path.resolve(__dirname + "/dist/")
      }
    ])
  ]
};
