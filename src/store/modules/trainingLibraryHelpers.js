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
    callForLanguages({ commit, dispatch }) {
      AwarenessEducatorService.getLanguages().then((response) => {
        commit('SET_LANGUAGES', response?.data?.data)
        console.log('response?.data?.data', response?.data?.data)
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
