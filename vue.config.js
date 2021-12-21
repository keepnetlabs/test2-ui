// vue.config.js
module.exports = {
  publicPath: '/',
  productionSourceMap: process.env.NODE_ENV !== 'production',
  configureWebpack: {
    optimization: {
      minimize: process.env.NODE_ENV === 'production',
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
              return `npm.${packageName.replace('@', '')}`
            }
          }
        }
      }
    },
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
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].meta = {}
      args[0].meta['content-type'] = {
        'http-equiv': 'content-type',
        content: 'text/html; charset=UTF-8'
      }
      return args
    })
  }
}
