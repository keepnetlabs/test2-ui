const whitelabel = {
  namespaced: true,
  state: {
    brandName: '',
    mainDomainProtocol: '',
    mainDomainUrl: '',
    mainLogoFile: null,
    minimizedMenuLogoFile: null,
    faviconFile: null,
    emailTemplateLogoFile: null,
    supportEmailAddress: null,
    footerPrivacyPolicyUrl: '',
    footerTermsAndConditionsUrl: '',
    footerEulaUrl: '',
    footerCookiePolicyUrl: '',
    isShowReleaseVersionNumber: false,
    isShowReleaseNotes: false,
    releaseNotesUrl: ''
  },
  getters: {
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
      mainLogoFile,
      minimizedMenuLogoFile,
      isShowReleaseVersionNumber,
      isShowReleaseNotes,
      releaseNotesUrl
    }) {
      return {
        mainLogoFile,
        minimizedMenuLogoFile,
        isShowReleaseVersionNumber,
        isShowReleaseNotes,
        releaseNotesUrl
      }
    },
    getSupportEmailAddress({ supportEmailAddress }) {
      return supportEmailAddress
    },
    getFavIcon({ faviconFile }) {
      return faviconFile
    },
    getBrandName({ brandName }) {
      return brandName
    }
  },
  mutations: {
    SET_DATA(state = {}, payload = {}) {
      for (const key of Object.keys(state)) {
        state[key] = payload[key]
      }
    }
  },
  actions: {
    callForData(payload = {}) {}
  }
}

export default whitelabel
