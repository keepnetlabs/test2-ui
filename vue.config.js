// vue.config.js

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: '@import "~@/assets/scss/main.scss"'
      }
    }
  },
  chainWebpack: config => {
    ;['vue-modules', 'vue', 'normal-modules', 'normal'].forEach(match => {
      config.module
        .rule('scss')
        .oneOf(match)
        .use('sass-loader')
        .tap(opt => Object.assign(opt, { data: "@import '~@/assets/scss/main.scss';" }))
    })
  },
  transpileDependencies: [
    'vuetify',
    'vue-tour',
    'apexcharts',
    'vue-apexcharts',
    'echarts',
    'vue-echarts',
    'vue-clamp',
    'resize-detector'
  ],
  lintOnSave: true
}
