import {
  deleteWhiteLabel,
  getSystemVersion,
  getWhiteLabel,
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
  releaseNotesUrl: '',
  systemVersion: null
}

const whitelabel = {
  namespaced: true,
  state: JSON.parse(JSON.stringify(initialState)),
  getters: {
    getState(state) {
      return state
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
      systemVersion
    }) {
      return {
        mainLogoUrl,
        minimizedMenuLogoUrl,
        isShowReleaseVersionNumber,
        isShowReleaseNotes,
        releaseNotesUrl,
        systemVersion
      }
    },
    getSupportEmailAddress({ supportEmailAddress }) {
      return supportEmailAddress
    },
    getFavIcon({ faviconUrl }) {
      return faviconUrl
    },
    getBrandName({ brandName }) {
      return brandName
    }
  },
  mutations: {
    SET_DATA(state = {}, payload = {}) {
      for (const key of Object.keys(state)) {
        if (key === 'faviconUrl' && payload[key]) {
          const favIcon = document.querySelector('link[rel="icon"]')
          favIcon.href = payload[key]
        }
        if (key !== 'systemVersion') {
          state[key] = payload[key]
        }
      }
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
    }
  },
  actions: {
    callForData(context = {}) {
      context.commit('TOGGLE_LOADING', true)
      getWhiteLabel()
        .then((response) => {
          context.commit('SET_DATA', response.data.data)
        })
        .finally(() => context.commit('TOGGLE_LOADING', false))
    },
    updateData(context = {}, payload = {}) {
      const formData = new FormData()
      const id = payload['resourceId']
      delete payload.id
      Object.keys(payload).map((key) => {
        formData.append(key.charAt(0).toLocaleUpperCase('en-EN') + key.slice(1), payload[key])
      })
      for (const [key, value] of formData.entries()) {
        //console.log(`${key}:${value}`)
      }
      return updateWhiteLabel(formData, id).then(() => {
        context.dispatch('callForData')
        context.dispatch('callForSystemVersion')
      })
    },
    resetToDefault(context = {}) {
      return deleteWhiteLabel(context.state.resourceId).then((response) => {
        context.dispatch('callForData')
      })
    },
    callForSystemVersion(context = {}, payload = {}) {
      getSystemVersion().then((response) => {
        //console.log(' response.data.data.version', response.data.data.version)
        context.commit('SET_SYSTEM_VERSION', response.data.data.version)
      })
    },
    resetState(context = {}) {
      context.commit('RESET_STATE', JSON.parse(JSON.stringify(initialState)))
    }
  }
}

export default whitelabel
