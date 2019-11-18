const P = require('path');

module.exports = {
  entry: './src/Promise.js',
  output: {
    filename: 'index.js',
    path: P.resolve(__dirname, '../dist'),
    library: 'Promise',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this'
  }
};
