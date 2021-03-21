import { getWhiteLabel, updateWhiteLabel } from '@/api/whitelabel'

const whitelabel = {
  namespaced: true,
  state: {
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
    releaseNotesUrl: ''
  },
  getters: {
    getState(state) {
      return state
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
    },
    TOGGLE_LOADING(state, payload) {
      state.loading = payload
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
      return updateWhiteLabel(formData, id).then((response) => {
        context.dispatch('callForData')
      })
    }
  }
}

export default whitelabel
