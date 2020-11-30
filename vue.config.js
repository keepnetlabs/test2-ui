// vue.config.js
const path = require('path')

module.exports = {
  publicPath: '/',
  productionSourceMap: process.env.NODE_ENV != 'production',
  configureWebpack: {
    module: {
      rules: [
        {
          test: /config.*config\.js$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'config.js'
              }
            }
          ]
        }
      ]
    }
  }
}
