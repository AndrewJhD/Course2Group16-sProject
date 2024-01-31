const path = require('path');

module.exports = {
  entry: './src/index.js', // Your entry point
  output: {
    filename: 'main.js', // Output bundle file name
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  mode: 'development', // You can set this to 'production' for optimizations
};