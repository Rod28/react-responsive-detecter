const path = require('path');

/**
 * To review the configuration of this file, as well as add or delete properties,
 * consult the following link.
 *
 * webpack-dev-server configuration
 * @see https://webpack.js.org/configuration/dev-server/
 *
 * webpack-dev-server doc
 * @see https://github.com/webpack/webpack-dev-server
 */
module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'server/src/index.tsx'),
  devtool: 'eval', // Eliminate the generation of source maps
  output: {
    filename: 'bundle.js'
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'server')
    },
    client: {
      logging: 'info'
    },
    open: {
      app: {
        name: 'google-chrome'
      }
    },
    compress: true,
    port: 9000
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        /**
         * @see https://webpack.js.org/loaders/style-loader/
         * @see https://webpack.js.org/loaders/css-loader/
         */
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader'
        ]
      }
    ]
  }
};
