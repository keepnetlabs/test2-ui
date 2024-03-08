import AwarenessEducatorService from '@/api/awarenessEducator'

const trainingLibraryHelpers = {
  namespaced: true,
  state: {
    categories: [],
    scormTypes: [],
    languages: [],
    targetAudiences: [],
    compliances: [],
    trainingVendors: [],
    behaviours: []
  },
  getters: {
    getCategories(state) {
      return state.categories
    },
    getScormTypes(state) {
      return state.scormTypes
    },
    getLanguages(state) {
      return state.languages
    },
    getTargetAudiences(state) {
      return state.targetAudiences
    },
    getCompliances(state) {
      return state.compliances
    },
    getTrainingVendors(state) {
      return state.trainingVendors
    },
    getBehaviours(state) {
      return state.behaviours
    }
  },
  mutations: {
    SET_CATEGORIES(state, payload) {
      state.categories = payload
    },
    SET_SCORM_TYPES(state, payload) {
      state.scormTypes = payload
    },
    SET_LANGUAGES(state, payload) {
      state.languages = payload
    },
    SET_TARGET_AUDIENCES(state, payload) {
      state.targetAudiences = payload
    },
    SET_COMPLIANCES(state, payload) {
      state.compliances = payload
    },
    SET_TRAINING_VENDORS(state, payload) {
      state.trainingVendors = payload
    },
    SET_BEHAVIOURS(state, payload) {
      state.behaviours = payload
    }
  },
  actions: {
    callForTrainingHelpers({ commit, dispatch }) {
      dispatch('callForCategories')
      dispatch('callForScormTypes')
      dispatch('callForLanguages')
      dispatch('callForTargetAudiences')
      dispatch('callForCompliances')
      dispatch('callForTrainingVendors')
      dispatch('callForBehaviours')
    },
    callForCategories({ commit }) {
      AwarenessEducatorService.getCategories().then((response) => {
        commit(
          'SET_CATEGORIES',
          response?.data?.data?.map((category) => ({
            text: category.displayName || category.name,
            value: category.name
          })) || []
        )
      })
    },
    callForScormTypes({ commit }) {
      AwarenessEducatorService.getScormTypes().then((response) => {
        commit(
          'SET_SCORM_TYPES',
          response?.data?.data?.map((type) => ({
            text: type.displayName,
            value: type.name
          })) || []
        )
      })
    },
    callForLanguages({ commit }) {
      AwarenessEducatorService.getLanguages().then((response) => {
        commit('SET_LANGUAGES', response?.data?.data)
      })
    },
    callForTargetAudiences({ commit }) {
      AwarenessEducatorService.getTargetAudiences().then((response) => {
        commit(
          'SET_TARGET_AUDIENCES',
          response?.data?.data?.map((targetAudience) => ({
            text: targetAudience.displayName,
            value: targetAudience.name
          })) || []
        )
      })
    },
    callForCompliances({ commit }) {
      AwarenessEducatorService.getTargetAudiences().then((response) => {
        commit(
          'SET_COMPLIANCES',
          response?.data?.data?.map((compliance) => ({
            text: compliance.displayName,
            value: compliance.name
          })) || []
        )
      })
    },
    callForTrainingVendors({ commit }) {
      AwarenessEducatorService.getTargetAudiences().then((response) => {
        commit(
          'SET_TRAINING_VENDORS',
          response?.data?.data?.map((compliance) => ({
            text: compliance.displayName,
            value: compliance.name
          })) || []
        )
      })
    },
    callForBehaviours({ commit }) {
      AwarenessEducatorService.getTargetAudiences().then((response) => {
        commit(
          'SET_BEHAVIOURS',
          response?.data?.data?.map((compliance) => ({
            text: compliance.displayName,
            value: compliance.name
          })) || []
        )
      })
    }
  }
}

export default trainingLibraryHelpers
