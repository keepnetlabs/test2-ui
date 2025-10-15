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
          const favIcon = document.querySelector('link[rel="icon"]')
          if (favIcon) {
            favIcon.href = payload[key]
          }
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
    SET_SHOW_EXCEED_DIALOG(state) {
      state.showLicenseExceededDialog = !state.showLicenseExceededDialog
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
            context.commit('SET_SHOW_EXCEED_DIALOG')
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
      context.commit('SET_SHOW_EXCEED_DIALOG')
    }
  }
}

export default whitelabel
