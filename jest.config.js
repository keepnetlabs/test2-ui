const path = require('path')
module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  globals: {
    name: 'gurkan',
    APP_CONFIG: {
      VUE_APP_IS_CLOUD: false,
      VUE_APP_GTM_STATUS: true,
      VUE_APP_SENTRY_STATUS: true,
      VUE_APP_FULLSTORY_STATUS: true,
      VUE_APP_HOTJAR_STATUS: true,
      VUE_APP_NEW_RELIC_STATUS: false,
      VUE_APP_MIX_PANEL_STATUS: true,
      VUE_APP_NEW_RELIC_VALUE: {},
      VUE_APP_GTM_ID: 'GTM-5DXK5QR',
      VUE_APP_GTM_ENV: 'env-2',
      VUE_APP_GTM_AUTH: 'I1b3uvylzeFmHZSN1qMHrw',
      VUE_APP_SENTRY_DSN:
        'https://d33f2fcc4295420588d442dfde43d2c5@o466336.ingest.sentry.io/5480520',
      VUE_APP_HOTJAR_ID: '2045435',
      VUE_APP_FULLSTORY_ID: 'TRDZX',
      VUE_APP_ANALYTICS_ID: 'UA-131042304-4',
      VUE_APP_MIX_PANEL_TOKEN: '4b3fbde44fceac0674902099f5075dad',
      VUE_APP_ROOT_API: 'https://dev-api.devkeepnet.com/api',
      VUE_APP_WEB_API: 'https://dev-api.devkeepnet.com/api',
      VUE_APP_WEB_API_TEST: 'https://dev-api.devkeepnet.com/api',
      VUE_APP_API_KEY: '9DtfGZnBazfjbZ47VJJZ2NNV6BXry6gxkmpRWAhX',
      VUE_APP_AUTH_API_TEST: 'https://dev-api.devkeepnet.com',
      VUE_APP_APP_API_TEST: 'https://dev-api.devkeepnet.com/api'
    }
  },
  setupFiles: ['<rootDir>/tests/unit/index.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    'vuetify/lib(.*)': '<rootDir>/node_modules/vuetify/es5$1'
  },
  modulePaths: ['<rootDir>/src', '<rootDir>/node_modules'],
  transform: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.ts?$': 'ts-jest',
    '.*\\.(vue)$': 'vue-jest'
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(vuetify)/)']
}

const coverageObj = {
  collectCoverage: true,
  collectCoverageFrom: ['**/*.{js,vue}', '!**/node_modules/**', '!**/public/**', '!**/dist/**'],
  coverageDirectory: path.join(__dirname, 'coverage')
}
