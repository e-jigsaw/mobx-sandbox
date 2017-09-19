const {resolve} = require('path')

module.exports = {
  context: process.cwd(),
  entry: {
    app: './index.js'
  },
  output: {
    filename: 'index.js',
    path: resolve(__dirname, './public')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            ['env', { modules: false }]
          ],
          plugins: [
            'transform-pug-to-react', 'transform-decorators',
            [
              'transform-class-properties',
              {loose: true}
            ]
          ],
          cacheDirectory: './tmp'
        }
      }
    ]
  }
}
