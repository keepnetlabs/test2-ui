import AwarenessEducatorService from "@/api/awarenessEducator";
import { getScenarioDataDetails } from "@/api/scenarios";
import LookupLocalStorage from "@/helper-classes/lookup-local-storage";
import { distributionDelayTimeTypes } from "@/components/TrainingLibrary/utils";
import { PROPERTY_STORE } from "@/model/constants/commonConstants";

const trainingLibraryHelpers = {
  namespaced: true,
  state: {
    preferredLanguageTypes: [],
    categories: [],
    scormTypes: [],
    languages: [],
    targetAudiences: [],
    compliances: [],
    trainingVendors: [],
    types: [],
    levels: [],
    durations: [],
    learningPathTrainingTypes: [],
    behaviours: [],
    enumTypes: {},
    canSaveVendor: false,
    distributionDelayTimeTypes: distributionDelayTimeTypes,
    certificateEmailNotificationTemplateTypeResourceId: [],
    reminderEmailNotificationTemplateTypeResourceId: [],
    trainingEmailNotificationTemplateTypeResourceId: [],
    infographicEmailNotificationTemplateTypeResourceId: "",
    learningPathEmailNotificationTemplateTypeResourceId: "",
    posterEmailNotificationTemplateTypeResourceId: "",
    learningPathReminderEmailNotificationTemplateTypeResourceId: "",
    surveyEmailNotificationTemplateTypeResourceId: "",
    surveyReminderEmailNotificationTemplateTypeResourceId: ""
  },
  getters: {
    getCategories(state) {
      return state.categories;
    },
    getScormTypes(state) {
      return state.scormTypes;
    },
    getLanguages(state) {
      return state.languages;
    },
    getPreferredLanguageTypes(state) {
      return state.preferredLanguageTypes;
    },
    getTargetAudiences(state) {
      return state.targetAudiences;
    },
    getCompliances(state) {
      return state.compliances;
    },
    getTrainingVendors(state) {
      return state.trainingVendors;
    },
    getLevels(state) {
      return state.levels;
    },
    getDurations(state) {
      return state.durations;
    },
    getBehaviours(state) {
      return state.behaviours;
    },
    getDistributionDelayTimeTypes(state) {
      return state.distributionDelayTimeTypes;
    },
    getEnumTypes(state) {
      return state.enumTypes;
    },
    getCertificateEmailNotificationTemplateTypeResourceId(state) {
      return state.certificateEmailNotificationTemplateTypeResourceId;
    },
    getReminderEmailNotificationTemplateTypeResourceId(state) {
      return state.reminderEmailNotificationTemplateTypeResourceId;
    },
    getTrainingEmailNotificationTemplateTypeResourceId(state) {
      return state.trainingEmailNotificationTemplateTypeResourceId;
    },
    getSurveyEmailNotificationTemplateTypeResourceId(state) {
      return state.surveyEmailNotificationTemplateTypeResourceId;
    },
    getSurveyReminderEmailNotificationTemplateTypeResourceId(state) {
      return state.surveyReminderEmailNotificationTemplateTypeResourceId;
    },
    getInfographicEmailNotificationTemplateTypeResourceId(state) {
      return state.infographicEmailNotificationTemplateTypeResourceId;
    },
    getLearningPathEmailNotificationTemplateTypeResourceId(state) {
      return state.learningPathEmailNotificationTemplateTypeResourceId;
    },
    getLearningPathReminderEmailNotificationTemplateTypeResourceId(state) {
      return state.learningPathReminderEmailNotificationTemplateTypeResourceId;
    },
    getPosterEmailNotificationTemplateTypeResourceId(state) {
      return state.posterEmailNotificationTemplateTypeResourceId;
    },
    getTrainingTypes(state) {
      return state.types;
    },
    getLearningPathTrainingTypes(state) {
      return state.learningPathTrainingTypes;
    },
    getCanSaveVendor(state) {
      return state.canSaveVendor;
    }
  },
  mutations: {
    SET_CATEGORIES(state, payload) {
      state.categories = payload;
    },
    SET_SCORM_TYPES(state, payload) {
      state.scormTypes = payload;
    },
    SET_LANGUAGES(state, payload) {
      state.languages = payload;
    },
    SET_PREFERRED_LANGUAGE_TYPES(state, payload) {
      state.preferredLanguageTypes = payload;
    },
    SET_TARGET_AUDIENCES(state, payload) {
      state.targetAudiences = payload;
    },
    SET_COMPLIANCES(state, payload) {
      state.compliances = payload;
    },
    SET_TRAINING_VENDORS(state, payload) {
      state.trainingVendors = payload;
    },
    SET_LEVELS(state, payload) {
      state.levels = payload;
    },
    SET_DURATIONS(state, payload) {
      state.durations = payload;
    },
    SET_BEHAVIOURS(state, payload) {
      state.behaviours = payload;
    },
    SET_ENUM_TYPES(state, payload) {
      state.enumTypes = payload;
    },
    SET_CERTIFICATE_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(
      state,
      payload
    ) {
      state.certificateEmailNotificationTemplateTypeResourceId = payload;
    },
    SET_REMINDER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, payload) {
      state.reminderEmailNotificationTemplateTypeResourceId = payload;
    },
    SET_TRAINING_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, payload) {
      state.trainingEmailNotificationTemplateTypeResourceId = payload;
    },
    SET_SURVEY_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, payload) {
      state.surveyEmailNotificationTemplateTypeResourceId = payload;
    },
    SET_SURVEY_REMINDER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(
      state,
      payload
    ) {
      state.surveyReminderEmailNotificationTemplateTypeResourceId = payload;
    },
    SET_LEARNING_PATH_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(
      state,
      payload
    ) {
      state.learningPathEmailNotificationTemplateTypeResourceId = payload;
    },
    SET_LEARNING_PATH_REMINDER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(
      state,
      payload
    ) {
      state.learningPathReminderEmailNotificationTemplateTypeResourceId = payload;
    },
    SET_POSTER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, payload) {
      state.posterEmailNotificationTemplateTypeResourceId = payload;
    },
    SET_INFOGRAPHIC_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(
      state,
      payload
    ) {
      state.infographicEmailNotificationTemplateTypeResourceId = payload;
    },
    SET_TYPES(state, payload) {
      state.types = payload;
    },
    SET_LEARNING_PATH_TRAINING_TYPES(state, payload) {
      state.learningPathTrainingTypes = payload;
    },
    SET_CAN_SAVE_VENDOR(state, payload) {
      state.canSaveVendor = payload;
    }
  },
  actions: {
    callForTrainingHelpers({ dispatch }) {
      dispatch("callForFormDetails");
      dispatch("callForScenarioFormDetails");
      dispatch("callForCategories");
      dispatch("callForScormTypes");
      dispatch("callForLanguages");
      dispatch("callForTargetAudiences");
      dispatch("callForCompliances");
      dispatch("callForTrainingVendors");
      dispatch("callForLevels");
      dispatch("callForDurations");
      dispatch("callForBehaviours");
      dispatch("callForTypes");
    },
    callForCategories({ commit, dispatch }) {
      AwarenessEducatorService.getCategories().then((response) => {
        const categories =
          response?.data?.data?.map((category) => ({
            text: category.displayName || category.name,
            value: category.name
          })) || [];
        commit("SET_CATEGORIES", categories);
        dispatch(
          "trainingLibrary/setFilterItems",
          {
            key: PROPERTY_STORE.CATEGORY,
            items: categories
          },
          { root: true }
        );
        dispatch(
          "learningPath/setLearningPathFilterItems",
          {
            key: PROPERTY_STORE.CATEGORY,
            items: categories
          },
          { root: true }
        );
      });
    },
    callForScormTypes({ commit }) {
      AwarenessEducatorService.getScormTypes().then((response) => {
        commit(
          "SET_SCORM_TYPES",
          response?.data?.data?.map((type) => ({
            text: type.displayName,
            value: type.name
          })) || []
        );
      });
    },
    callForLanguages({ commit, dispatch }) {
      AwarenessEducatorService.getLanguages().then((response) => {
        commit("SET_LANGUAGES", response?.data?.data);
        dispatch(
          "trainingLibrary/setFilterItems",
          {
            key: PROPERTY_STORE.LANGUAGES,
            items: response?.data?.data.map((l) => ({
              text: l.isoFriendlyName,
              value: l.code
            }))
          },
          { root: true }
        );
        dispatch(
          "learningPath/setLearningPathFilterItems",
          {
            key: PROPERTY_STORE.LANGUAGES,
            items: response?.data?.data.map((l) => ({
              text: l.isoFriendlyName,
              value: l.code
            }))
          },
          { root: true }
        );
      });
    },
    callForTargetAudiences({ commit, dispatch }) {
      AwarenessEducatorService.getTargetAudiences().then((response) => {
        const targetAudience =
          response?.data?.data?.map((targetAudience) => {
            const id =
              targetAudience.id ||
              targetAudience.roleId ||
              targetAudience.resourceId ||
              targetAudience.targetAudienceId;
            return {
              id,
              text: targetAudience.displayName,
              value: id == null ? "" : String(id)
            };
          }) || [];
        commit("SET_TARGET_AUDIENCES", targetAudience);
        dispatch(
          "trainingLibrary/setFilterItems",
          {
            key: PROPERTY_STORE.TARGET_AUDIENCE,
            items: targetAudience
          },
          { root: true }
        );
        dispatch(
          "learningPath/setLearningPathFilterItems",
          {
            key: PROPERTY_STORE.TARGET_AUDIENCE,
            items: targetAudience
          },
          { root: true }
        );
      });
    },
    callForCompliances({ commit, dispatch }) {
      AwarenessEducatorService.getCompliances().then((response) => {
        const compliances =
          response?.data?.data?.map((compliance) => ({
            text: compliance.name,
            value: compliance.id
          })) || [];
        commit("SET_COMPLIANCES", compliances);
        dispatch(
          "trainingLibrary/setFilterItems",
          {
            key: PROPERTY_STORE.COMPLIANCE,
            items: compliances
          },
          { root: true }
        );
        dispatch(
          "learningPath/setLearningPathFilterItems",
          {
            key: PROPERTY_STORE.COMPLIANCE,
            items: compliances
          },
          { root: true }
        );
      });
    },
    callForTrainingVendors({ commit, dispatch }) {
      AwarenessEducatorService.getVendors().then((response) => {
        const vendors =
          response?.data?.data?.map((vendor) => ({
            text: vendor.name,
            value: vendor.id
          })) || [];
        commit("SET_TRAINING_VENDORS", vendors);
        dispatch(
          "trainingLibrary/setFilterItems",
          {
            key: PROPERTY_STORE.VENDOR,
            items: vendors
          },
          { root: true }
        );
        dispatch(
          "learningPath/setLearningPathFilterItems",
          {
            key: PROPERTY_STORE.VENDOR,
            items: vendors
          },
          { root: true }
        );
      });
    },
    callForLevels({ commit, dispatch }) {
      AwarenessEducatorService.getTrainingLevels().then((response) => {
        const levels =
          response?.data?.data?.map((level) => ({
            id: level.id || level.resourceId || level.levelId || "",
            name: level.name || level.displayName || "",
            text: level.displayName || level.name,
            value: level.id == null ? "" : String(level.id)
          })) || [];
        commit("SET_LEVELS", levels);
        dispatch(
          "trainingLibrary/setFilterItems",
          {
            key: PROPERTY_STORE.LEVEL,
            items: levels
          },
          { root: true }
        );
        dispatch(
          "learningPath/setLearningPathFilterItems",
          {
            key: PROPERTY_STORE.LEVEL,
            items: levels
          },
          { root: true }
        );
      });
    },
    callForDurations({ commit, dispatch }) {
      AwarenessEducatorService.getTrainingDurations().then((response) => {
        const durations =
          response?.data?.data?.map((duration) => ({
            id: duration.id || duration.resourceId || duration.durationId || "",
            name: duration.name || duration.displayName || "",
            text: duration.displayName || duration.name,
            value: duration.id == null ? "" : String(duration.id)
          })) || [];
        commit("SET_DURATIONS", durations);
        dispatch(
          "trainingLibrary/setFilterItems",
          {
            key: PROPERTY_STORE.DURATION,
            items: durations
          },
          { root: true }
        );
        dispatch(
          "learningPath/setLearningPathFilterItems",
          {
            key: PROPERTY_STORE.DURATION,
            items: durations
          },
          { root: true }
        );
      });
    },
    callForBehaviours({ commit, dispatch }) {
      AwarenessEducatorService.getBehaviours().then((response) => {
        const behaviours =
          response?.data?.data?.map((behaviour) => ({
            text: behaviour.name,
            value: behaviour.id
          })) || [];
        commit("SET_BEHAVIOURS", behaviours);
        dispatch(
          "trainingLibrary/setFilterItems",
          {
            key: PROPERTY_STORE.BEHAVIOURS,
            items: behaviours
          },
          { root: true }
        );
        dispatch(
          "learningPath/setLearningPathFilterItems",
          {
            key: PROPERTY_STORE.BEHAVIOURS,
            items: behaviours
          },
          { root: true }
        );
      });
    },
    callForTypes({ commit, dispatch }) {
      AwarenessEducatorService.getTrainingTypes().then((response) => {
        const types =
          response?.data?.data?.map((type) => ({
            text: type.displayName,
            value: type.id.toString()
          })) || [];
        const learningPathTrainingTypes = types.filter(
          (type) => !["Screensaver", "Learning Path"].includes(type.text)
        );
        commit("SET_TYPES", types);
        commit("SET_LEARNING_PATH_TRAINING_TYPES", learningPathTrainingTypes);
        dispatch(
          "trainingLibrary/setFilterItems",
          {
            key: PROPERTY_STORE.TYPE,
            items: types
          },
          { root: true }
        );
        dispatch(
          "learningPath/setLearningPathFilterItems",
          {
            key: PROPERTY_STORE.TYPE,
            items: learningPathTrainingTypes
          },
          { root: true }
        );
      });
    },
    callForScenarioFormDetails({ commit }) {
      LookupLocalStorage.getSingle(21)
        .then((languageOptions) => {
          const languageItems =
            languageOptions?.map((l) => ({
              text: l.isoFriendlyName || l.name,
              value: l.resourceId
            })) || [];
          return getScenarioDataDetails().then((response) => {
            const formDetailsData = response?.data?.data || {};
            const preferredRaw = formDetailsData.preferredLanguageTypes || [];
            const preferredLanguageTypes = preferredRaw
              .map(({ value }) => languageItems.find((lang) => lang.value === value))
              .filter(Boolean);
            commit("SET_PREFERRED_LANGUAGE_TYPES", preferredLanguageTypes);
          });
        })
        .catch(() => {
          commit("SET_PREFERRED_LANGUAGE_TYPES", []);
        });
    },
    callForFormDetails({ commit }) {
      AwarenessEducatorService.getEnrollmentFormDetails().then((response) => {
        const {
          certificateEmailNotificationTemplateTypeResourceId = "",
          reminderEmailNotificationTemplateTypeResourceId = "",
          trainingEmailNotificationTemplateTypeResourceId = "",
          surveyEmailNotificationTemplateTypeResourceId = "",
          surveyReminderEmailNotificationTemplateTypeResourceId = "",
          infographicEmailNotificationTemplateTypeResourceId = "",
          learningPathEmailNotificationTemplateTypeResourceId = "",
          posterEmailNotificationTemplateTypeResourceId = "",
          learningPathReminderEmailNotificationTemplateTypeResourceId = "",
          enumNameValuePairs = {},
          canSaveVendor = false
        } = response?.data?.data || {};
        commit("SET_ENUM_TYPES", enumNameValuePairs);
        commit(
          "SET_CERTIFICATE_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID",
          certificateEmailNotificationTemplateTypeResourceId
        );
        commit(
          "SET_REMINDER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID",
          reminderEmailNotificationTemplateTypeResourceId
        );
        commit(
          "SET_TRAINING_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID",
          trainingEmailNotificationTemplateTypeResourceId
        );
        commit(
          "SET_INFOGRAPHIC_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID",
          infographicEmailNotificationTemplateTypeResourceId
        );
        commit(
          "SET_LEARNING_PATH_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID",
          learningPathEmailNotificationTemplateTypeResourceId
        );
        commit(
          "SET_POSTER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID",
          posterEmailNotificationTemplateTypeResourceId
        );
        commit(
          "SET_SURVEY_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID",
          surveyEmailNotificationTemplateTypeResourceId
        );
        commit(
          "SET_SURVEY_REMINDER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID",
          surveyReminderEmailNotificationTemplateTypeResourceId
        );
        commit(
          "SET_LEARNING_PATH_REMINDER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID",
          learningPathReminderEmailNotificationTemplateTypeResourceId
        );
        commit("SET_CAN_SAVE_VENDOR", canSaveVendor);
      });
    }
  }
};

export default trainingLibraryHelpers;
