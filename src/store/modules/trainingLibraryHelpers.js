import AwarenessEducatorService from '@/api/awarenessEducator'
import { distributionDelayTimeTypes } from '@/components/TrainingLibrary/utils'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

const trainingLibraryHelpers = {
  namespaced: true,
  state: {
    categories: [],
    scormTypes: [],
    languages: [],
    targetAudiences: [],
    compliances: [],
    trainingVendors: [],
    behaviours: [],
    enumTypes: {},
    distributionDelayTimeTypes: distributionDelayTimeTypes,
    certificateEmailNotificationTemplateTypeResourceId: [],
    reminderEmailNotificationTemplateTypeResourceId: [],
    trainingEmailNotificationTemplateTypeResourceId: []
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
    },
    getDistributionDelayTimeTypes(state) {
      return state.distributionDelayTimeTypes
    },
    getEnumTypes(state) {
      return state.enumTypes
    },
    getCertificateEmailNotificationTemplateTypeResourceId(state) {
      return state.certificateEmailNotificationTemplateTypeResourceId
    },
    getReminderEmailNotificationTemplateTypeResourceId(state) {
      return state.reminderEmailNotificationTemplateTypeResourceId
    },
    getTrainingEmailNotificationTemplateTypeResourceId(state) {
      return state.trainingEmailNotificationTemplateTypeResourceId
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
    },
    SET_ENUM_TYPES(state, payload) {
      state.enumTypes = payload
    },
    SET_CERTIFICATE_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, payload) {
      state.certificateEmailNotificationTemplateTypeResourceId = payload
    },
    SET_REMINDER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, payload) {
      state.reminderEmailNotificationTemplateTypeResourceId = payload
    },
    SET_TRAINING_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, payload) {
      state.trainingEmailNotificationTemplateTypeResourceId = payload
    }
  },
  actions: {
    callForTrainingHelpers({ dispatch }) {
      dispatch('callForFormDetails')
      dispatch('callForCategories')
      dispatch('callForScormTypes')
      dispatch('callForLanguages')
      dispatch('callForTargetAudiences')
      dispatch('callForCompliances')
      dispatch('callForTrainingVendors')
      dispatch('callForBehaviours')
    },
    callForCategories({ commit, dispatch }) {
      AwarenessEducatorService.getCategories().then((response) => {
        const categories =
          response?.data?.data?.map((category) => ({
            text: category.displayName || category.name,
            value: category.name
          })) || []
        commit('SET_CATEGORIES', categories)
        dispatch(
          'trainingLibrary/setFilterItems',
          {
            key: PROPERTY_STORE.CATEGORY,
            items: categories
          },
          { root: true }
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
    callForLanguages({ commit, dispatch }) {
      AwarenessEducatorService.getLanguages().then((response) => {
        commit('SET_LANGUAGES', response?.data?.data)
        dispatch(
          'trainingLibrary/setFilterItems',
          {
            key: PROPERTY_STORE.LANGUAGES,
            items: response?.data?.data.map((l) => ({ text: l.name, value: l.code }))
          },
          { root: true }
        )
      })
    },
    callForTargetAudiences({ commit, dispatch }) {
      AwarenessEducatorService.getTargetAudiences().then((response) => {
        const targetAudience =
          response?.data?.data?.map((targetAudience) => ({
            text: targetAudience.displayName,
            value: targetAudience.name
          })) || []
        commit('SET_TARGET_AUDIENCES', targetAudience)
        dispatch(
          'trainingLibrary/setFilterItems',
          {
            key: PROPERTY_STORE.TARGET_AUDIENCE,
            items: targetAudience
          },
          { root: true }
        )
      })
    },
    callForCompliances({ commit, dispatch }) {
      AwarenessEducatorService.getCompliances().then((response) => {
        const compliances =
          response?.data?.data?.map((compliance) => ({
            text: compliance.name,
            value: compliance.id
          })) || []
        commit('SET_COMPLIANCES', compliances)
        dispatch(
          'trainingLibrary/setFilterItems',
          {
            key: PROPERTY_STORE.COMPLIANCE,
            items: compliances
          },
          { root: true }
        )
      })
    },
    callForTrainingVendors({ commit, dispatch }) {
      AwarenessEducatorService.getVendors().then((response) => {
        const vendors =
          response?.data?.data?.map((vendor) => ({
            text: vendor.name,
            value: vendor.id
          })) || []
        commit('SET_TRAINING_VENDORS', vendors)
        dispatch(
          'trainingLibrary/setFilterItems',
          {
            key: PROPERTY_STORE.VENDOR,
            items: vendors
          },
          { root: true }
        )
      })
    },
    callForBehaviours({ commit, dispatch }) {
      AwarenessEducatorService.getBehaviours().then((response) => {
        const behaviours =
          response?.data?.data?.map((behaviour) => ({
            text: behaviour.name,
            value: behaviour.id
          })) || []
        commit('SET_BEHAVIOURS', behaviours)
        dispatch(
          'trainingLibrary/setFilterItems',
          {
            key: PROPERTY_STORE.BEHAVIOURS,
            items: behaviours
          },
          { root: true }
        )
      })
    },
    callForFormDetails({ commit }) {
      AwarenessEducatorService.getEnrollmentFormDetails().then((response) => {
        const {
          certificateEmailNotificationTemplateTypeResourceId = '',
          reminderEmailNotificationTemplateTypeResourceId = '',
          trainingEmailNotificationTemplateTypeResourceId = '',
          enumNameValuePairs = {}
        } = response?.data?.data || {}
        commit('SET_ENUM_TYPES', enumNameValuePairs)
        commit(
          'SET_CERTIFICATE_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID',
          certificateEmailNotificationTemplateTypeResourceId
        )
        commit(
          'SET_REMINDER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID',
          reminderEmailNotificationTemplateTypeResourceId
        )
        commit(
          'SET_TRAINING_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID',
          trainingEmailNotificationTemplateTypeResourceId
        )
      })
    }
  }
}

export default trainingLibraryHelpers
