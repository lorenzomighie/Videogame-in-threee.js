const path = require('path')

module.exports = {
  entry: {
    app: './src/game.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'game.js'
  },
  devtool: 'inline-source-map',
  mode: 'development',
  module:{
    rules:[
      {
        test:/\.scss$/,
        use:['style-loader','css-loader', 'sass-loader']
      }
    ]
  }
}