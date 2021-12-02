const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

module.exports = (config) => {
  config.plugins.push(new WebpackManifestPlugin());
  return config;
};
