const APP_CONFIG = (() => {
  return {
    VUE_APP_IS_CLOUD: true,
    VUE_APP_HOTJAR_ID: '#{knl_hotjar_id}#',
    VUE_APP_FULLSTORY_ID: '#{knl_fullstory_id}#',
    VUE_APP_ANALYTICS_ID: '#{knl_google_analytics}#',
    VUE_APP_GTM_ID: '#{knl_google_tag_manager}#',
    VUE_APP_ROOT_API: '#{knl_api_address}#/api',
    VUE_APP_WEB_API: '#{knl_api_address}#/api',
    VUE_APP_WEB_API_TEST: '#{knl_api_address}#/api',
    VUE_APP_API_KEY: '#{knl_api_key}#',
    VUE_APP_AUTH_API_TEST: '#{knl_api_address}#',
    VUE_APP_APP_API_TEST: '#{knl_api_address}#/api',
    VUE_APP_SENTRY_DSN: '#{knl_sentry_dsn}#',
    VUE_APP_NEW_RELIC_STATUS: '#{knl_new_relic_status}#',
    VUE_APP_NEW_RELIC_VALUE: '#{knl_new_relic_value}#'
  }
})()
