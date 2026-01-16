import {
  callForSystemInfoSummary,
  deleteWhiteLabel,
  getSystemVersion,
  resolveWhiteLabel,
  updateWhiteLabel
} from '@/api/whitelabel'

const initialState = {
  resourceId: null,
  loading: true,
  brandName: '',
  mainDomainProtocol: '',
  mainDomainUrl: '',
  mainLogoUrl: null,
  minimizedMenuLogoUrl: null,
  faviconUrl: null,
  emailTemplateLogoUrl: null,
  supportEmailAddress: null,
  footerPrivacyPolicyUrl: '',
  footerTermsAndConditionsUrl: '',
  footerEulaUrl: '',
  footerCookiePolicyUrl: '',
  isShowReleaseVersionNumber: false,
  isShowReleaseNotes: false,
  isDocumentationLinkEnabled: false,
  releaseNotesUrl: '',
  systemVersion: null,
  companyLicense: null,
  showLicenseExceededDialog: false,
  countryCode: '',
  countryName: ''
}

const whitelabel = {
  namespaced: true,
  state: JSON.parse(JSON.stringify(initialState)),
  getters: {
    getShowLicenseDialog(state) {
      return state.showLicenseExceededDialog
    },
    getCompanyLicense(state) {
      return state.companyLicense
    },
    getEmailTemplateLogoUrl({ emailTemplateLogoUrl }) {
      return emailTemplateLogoUrl
    },
    getFooterLinks({
      footerPrivacyPolicyUrl,
      footerTermsAndConditionsUrl,
      footerEulaUrl,
      footerCookiePolicyUrl
    }) {
      return {
        footerCookiePolicyUrl,
        footerTermsAndConditionsUrl,
        footerEulaUrl,
        footerPrivacyPolicyUrl
      }
    },
    getNavigatorMenuProps({
      mainLogoUrl,
      minimizedMenuLogoUrl,
      isShowReleaseVersionNumber,
      isShowReleaseNotes,
      releaseNotesUrl,
      systemVersion,
      isDocumentationLinkEnabled
    }) {
      return {
        mainLogoUrl,
        minimizedMenuLogoUrl,
        isShowReleaseVersionNumber,
        isShowReleaseNotes,
        releaseNotesUrl,
        systemVersion,
        isDocumentationLinkEnabled
      }
    },
    getSupportEmailAddress({ supportEmailAddress }) {
      return supportEmailAddress
    },
    getBrandName({ brandName }) {
      return brandName
    },
    getCountryCode({ countryCode }) {
      return countryCode
    },
    getCountryName({ countryName }) {
      return countryName
    }
  },
  mutations: {
    SET_DATA(state = {}, payload = {}) {
      for (const key of Object.keys(state)) {
        if (key === 'faviconUrl' && payload[key]) {
          // Update favicon with cache busting to prevent Safari caching issues
          const faviconUrl = payload[key]
          const cacheBuster = `?v=${Date.now()}`
          const faviconWithCache = faviconUrl + cacheBuster

          // Update main favicon link
          let favIcon = document.querySelector('link[rel="icon"]')
          if (favIcon) {
            favIcon.href = faviconWithCache
          }

          // Update Apple touch icon for iOS Safari
          let appleLink = document.querySelector('link[rel="apple-touch-icon"]')
          if (appleLink) {
            appleLink.remove()
          }
          appleLink = document.createElement('link')
          appleLink.rel = 'apple-touch-icon'
          appleLink.href = faviconWithCache
          document.head.appendChild(appleLink)

          // Update shortcut icon for older browsers
          let shortcutLink = document.querySelector('link[rel="shortcut icon"]')
          if (shortcutLink) {
            shortcutLink.remove()
          }
          shortcutLink = document.createElement('link')
          shortcutLink.rel = 'shortcut icon'
          shortcutLink.href = faviconWithCache
          document.head.appendChild(shortcutLink)
        } else if (key === 'brandName' && payload[key]) {
          document.title = payload[key]
        }
        if (key !== 'systemVersion') {
          state[key] = payload[key]
        }
      }
      localStorage.setItem('whitelabelData', JSON.stringify(payload))
    },
    SET_SYSTEM_VERSION(state = {}, payload = {}) {
      state.systemVersion = payload
    },
    TOGGLE_LOADING(state, payload) {
      state.loading = payload
    },
    RESET_STATE(state, payload) {
      for (const key of Object.keys(state)) {
        state[key] = payload[key]
      }
    },
    SET_COMPANY_LICENSE(state, payload) {
      state.companyLicense = payload
    },
    SET_SHOW_EXCEED_DIALOG(state, payload) {
      state.showLicenseExceededDialog =
        typeof payload === 'boolean' ? payload : !state.showLicenseExceededDialog
    },
    SET_COUNTRY_NAME(state, payload) {
      state.countryName = payload
    }
  },
  actions: {
    callForData(context = {}) {
      context.commit('TOGGLE_LOADING', true)
      resolveWhiteLabel()
        .then((response) => {
          context.commit('SET_DATA', response?.data?.data)
        })
        .finally(() => context.commit('TOGGLE_LOADING', false))
    },
    updateData(context = {}, payload = {}) {
      const formData = new FormData()
      const id = payload['resourceId']
      delete payload.id

      Object.keys(payload).forEach((key) => {
        formData.append(key.charAt(0).toLocaleUpperCase('en-EN') + key.slice(1), payload[key])
      })

      return updateWhiteLabel(formData, id).then(() => {
        context.dispatch('callForData')
        context.dispatch('callForSystemVersion')
      })
    },
    resetToDefault(context = {}) {
      return deleteWhiteLabel(context.state.resourceId)
    },
    callForSystemVersion(context = {}) {
      getSystemVersion().then((response) => {
        context.commit('SET_SYSTEM_VERSION', response.data.data.version)
      })
    },
    callForSystemInfoSummary(context = {}, payload = {}) {
      callForSystemInfoSummary().then((response) => {
        const { versionInfo, companyLicense, company, summary = {} } = response?.data || {
          versionInfo: {
            data: {
              version: ''
            }
          },
          companyLicense: {
            data: ''
          }
        }
        context.commit('SET_SYSTEM_VERSION', versionInfo?.data?.version || '')
        if (payload.checkExceedDialog && typeof companyLicense.data === 'object') {
          const { isLicenseExceeded, isLimited } = companyLicense.data
          context.commit('SET_COMPANY_LICENSE', companyLicense?.data || '')
          if (isLimited && isLicenseExceeded) {
            context.dispatch('toggleShowExceedDialog')
          }
        }
        if (summary?.data?.countryCode) {
          context.commit('SET_DATA', {
            countryCode: summary?.data?.countryCode
          })
        }
        if (company?.data?.countryName) {
          context.commit('SET_COUNTRY_NAME', company.data.countryName)
        }
      })
    },
    resetState(context = {}) {
      context.commit('RESET_STATE', JSON.parse(JSON.stringify(initialState)))
    },
    setState(context, payload) {
      context.commit('SET_DATA', payload)
    },
    toggleShowExceedDialog(context) {
      const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000
      const currentState = context.state.showLicenseExceededDialog

      // Dialog'u kapatmak istiyorsak (açıksa false yap)
      if (currentState) {
        context.commit('SET_SHOW_EXCEED_DIALOG', false)
        return
      }

      // Company-specific storage key
      const rootGetters = context.rootGetters
      const companyId = rootGetters['login/getCurrentCompany']?.resourceId
      if (!companyId) return

      const STORAGE_KEY = `lastLicenseExceededDialogShown_${companyId}`
      const lastShownTime = localStorage.getItem(STORAGE_KEY)

      if (!lastShownTime) {
        // İlk kez gösteriliyorsa
        context.commit('SET_SHOW_EXCEED_DIALOG', true)
        localStorage.setItem(STORAGE_KEY, new Date().getTime().toString())
      } else {
        const currentTime = new Date().getTime()
        const lastShownTimeMs = parseInt(lastShownTime)
        const timeDifference = currentTime - lastShownTimeMs

        if (timeDifference > TWENTY_FOUR_HOURS_MS) {
          // 24 saat geçmişse göster
          context.commit('SET_SHOW_EXCEED_DIALOG', true)
          localStorage.setItem(STORAGE_KEY, new Date().getTime().toString())
        }
        // 24 saat geçmemişse dialog'u açma
      }
    }
  }
}

export default whitelabel
