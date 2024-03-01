// webpack.config.js
const CopyPlugin = require('copy-webpack-plugin');

const dontBundlePdf2Json = new CopyPlugin({
  patterns: ['node_modules/pdf2json/**/*'],
});

module.exports = {
  /* all the other configuration */
  externals: ['pdf2json'],
  plugins: [dontBundlePdf2Json],
}