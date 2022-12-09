const APP_CONFIG = (() => {
  return {
    VUE_APP_IS_CLOUD: #{knl_cloud_status}#,
    VUE_APP_GTM_STATUS: #{knl_google_tag_manager_status}#,
    VUE_APP_SENTRY_STATUS: #{knl_sentry_dsn_status}#,
    VUE_APP_FULLSTORY_STATUS: #{knl_fullstory_status}#,
    VUE_APP_GTM_ID: '#{knl_google_tag_manager}#',
    VUE_APP_GTM_ENV: '#{knl_google_tag_manager_env}#',
    VUE_APP_GTM_AUTH: '#{knl_google_tag_manager_auth}#',
    VUE_APP_SENTRY_DSN: '#{knl_sentry_dsn}#',
    VUE_APP_FULLSTORY_ID: '#{knl_fullstory_id}#',
    VUE_APP_ANALYTICS_ID: '#{knl_google_analytics}#',
    VUE_APP_ROOT_API: '#{knl_api_address}#/api',
    VUE_APP_WEB_API: '#{knl_api_address}#/api',
    VUE_APP_WEB_API_TEST: '#{knl_api_address}#/api',
    VUE_APP_API_KEY: '#{knl_api_key}#',
    VUE_APP_AUTH_API_TEST: '#{knl_api_address}#',
    VUE_APP_APP_API_TEST: '#{knl_api_address}#/api',
    VUE_APP_RECAPTCHA_SITEKEY: '#{knl_recaptcha_sitekey}#',
    VUE_APP_PHISHING_REPORTER_URL:'#{knl_phishing_reporter_url}#',
    VUE_APP_EMAIL_THREAT_SIMULATOR_API: '#{knl_ets_url}#',
    VUE_APP_AWARENESS_URL:'#{knl_awareness_url}#',
    VUE_APP_THREATS_INTELLIGENCE_URL: '#{knl_ti_url}#'
  }
})()
