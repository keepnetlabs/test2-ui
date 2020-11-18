// vue.config.js

const path = require('path')
module.exports = {
  publicPath: '/',
  productionSourceMap: false,
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
