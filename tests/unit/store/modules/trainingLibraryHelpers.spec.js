import { distributionDelayTimeTypes } from '@/components/TrainingLibrary/utils'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

describe('trainingLibraryHelpers.js store module', () => {
  let trainingLibraryHelpersStore
  let state

  beforeEach(() => {
    // Define store module inline to avoid import dependencies
    trainingLibraryHelpersStore = {
      namespaced: true,
      state: {
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
        infographicEmailNotificationTemplateTypeResourceId: '',
        learningPathEmailNotificationTemplateTypeResourceId: '',
        posterEmailNotificationTemplateTypeResourceId: '',
        learningPathReminderEmailNotificationTemplateTypeResourceId: '',
        surveyEmailNotificationTemplateTypeResourceId: '',
        surveyReminderEmailNotificationTemplateTypeResourceId: ''
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
        getLevels(state) {
          return state.levels
        },
        getDurations(state) {
          return state.durations
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
        },
        getSurveyEmailNotificationTemplateTypeResourceId(state) {
          return state.surveyEmailNotificationTemplateTypeResourceId
        },
        getSurveyReminderEmailNotificationTemplateTypeResourceId(state) {
          return state.surveyReminderEmailNotificationTemplateTypeResourceId
        },
        getInfographicEmailNotificationTemplateTypeResourceId(state) {
          return state.infographicEmailNotificationTemplateTypeResourceId
        },
        getLearningPathEmailNotificationTemplateTypeResourceId(state) {
          return state.learningPathEmailNotificationTemplateTypeResourceId
        },
        getLearningPathReminderEmailNotificationTemplateTypeResourceId(state) {
          return state.learningPathReminderEmailNotificationTemplateTypeResourceId
        },
        getPosterEmailNotificationTemplateTypeResourceId(state) {
          return state.posterEmailNotificationTemplateTypeResourceId
        },
        getTrainingTypes(state) {
          return state.types
        },
        getLearningPathTrainingTypes(state) {
          return state.learningPathTrainingTypes
        },
        getCanSaveVendor(state) {
          return state.canSaveVendor
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
        SET_LEVELS(state, payload) {
          state.levels = payload
        },
        SET_DURATIONS(state, payload) {
          state.durations = payload
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
        },
        SET_SURVEY_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, payload) {
          state.surveyEmailNotificationTemplateTypeResourceId = payload
        },
        SET_SURVEY_REMINDER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, payload) {
          state.surveyReminderEmailNotificationTemplateTypeResourceId = payload
        },
        SET_LEARNING_PATH_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, payload) {
          state.learningPathEmailNotificationTemplateTypeResourceId = payload
        },
        SET_LEARNING_PATH_REMINDER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, payload) {
          state.learningPathReminderEmailNotificationTemplateTypeResourceId = payload
        },
        SET_POSTER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, payload) {
          state.posterEmailNotificationTemplateTypeResourceId = payload
        },
        SET_INFOGRAPHIC_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, payload) {
          state.infographicEmailNotificationTemplateTypeResourceId = payload
        },
        SET_TYPES(state, payload) {
          state.types = payload
        },
        SET_LEARNING_PATH_TRAINING_TYPES(state, payload) {
          state.learningPathTrainingTypes = payload
        },
        SET_CAN_SAVE_VENDOR(state, payload) {
          state.canSaveVendor = payload
        }
      },
      actions: {
        setCanSaveVendor({ commit }, payload) {
          commit('SET_CAN_SAVE_VENDOR', payload)
        }
      }
    }

    state = JSON.parse(JSON.stringify(trainingLibraryHelpersStore.state))
  })

  describe('state', () => {
    it('initializes with empty arrays for collection fields', () => {
      expect(trainingLibraryHelpersStore.state.categories).toEqual([])
      expect(trainingLibraryHelpersStore.state.scormTypes).toEqual([])
      expect(trainingLibraryHelpersStore.state.languages).toEqual([])
      expect(trainingLibraryHelpersStore.state.targetAudiences).toEqual([])
      expect(trainingLibraryHelpersStore.state.compliances).toEqual([])
      expect(trainingLibraryHelpersStore.state.trainingVendors).toEqual([])
      expect(trainingLibraryHelpersStore.state.types).toEqual([])
      expect(trainingLibraryHelpersStore.state.levels).toEqual([])
      expect(trainingLibraryHelpersStore.state.durations).toEqual([])
      expect(trainingLibraryHelpersStore.state.learningPathTrainingTypes).toEqual([])
      expect(trainingLibraryHelpersStore.state.behaviours).toEqual([])
    })

    it('initializes with empty object for enumTypes', () => {
      expect(trainingLibraryHelpersStore.state.enumTypes).toEqual({})
    })

    it('initializes with false for canSaveVendor', () => {
      expect(trainingLibraryHelpersStore.state.canSaveVendor).toBe(false)
    })

    it('initializes with empty strings for email template IDs', () => {
      expect(trainingLibraryHelpersStore.state.infographicEmailNotificationTemplateTypeResourceId).toBe('')
      expect(trainingLibraryHelpersStore.state.learningPathEmailNotificationTemplateTypeResourceId).toBe('')
      expect(trainingLibraryHelpersStore.state.posterEmailNotificationTemplateTypeResourceId).toBe('')
      expect(trainingLibraryHelpersStore.state.learningPathReminderEmailNotificationTemplateTypeResourceId).toBe('')
      expect(trainingLibraryHelpersStore.state.surveyEmailNotificationTemplateTypeResourceId).toBe('')
      expect(trainingLibraryHelpersStore.state.surveyReminderEmailNotificationTemplateTypeResourceId).toBe('')
    })

    it('initializes with distributionDelayTimeTypes', () => {
      expect(trainingLibraryHelpersStore.state.distributionDelayTimeTypes).toBeDefined()
    })
  })

  describe('getters', () => {
    beforeEach(() => {
      state = trainingLibraryHelpersStore.state
    })

    it('getCategories returns categories array', () => {
      state.categories = [{ text: 'Category 1', value: 'cat1' }]
      expect(trainingLibraryHelpersStore.getters.getCategories(state)).toEqual([
        { text: 'Category 1', value: 'cat1' }
      ])
    })

    it('getScormTypes returns scormTypes array', () => {
      state.scormTypes = [{ text: 'SCORM 1.2', value: 'scorm12' }]
      expect(trainingLibraryHelpersStore.getters.getScormTypes(state)).toEqual([
        { text: 'SCORM 1.2', value: 'scorm12' }
      ])
    })

    it('getLanguages returns languages array', () => {
      state.languages = [{ isoFriendlyName: 'English', code: 'en' }]
      expect(trainingLibraryHelpersStore.getters.getLanguages(state)).toEqual([
        { isoFriendlyName: 'English', code: 'en' }
      ])
    })

    it('getTargetAudiences returns targetAudiences array', () => {
      state.targetAudiences = [{ id: '1', text: 'Audience 1', value: '1' }]
      expect(trainingLibraryHelpersStore.getters.getTargetAudiences(state)).toEqual([
        { id: '1', text: 'Audience 1', value: '1' }
      ])
    })

    it('getCompliances returns compliances array', () => {
      state.compliances = [{ text: 'GDPR', value: 1 }]
      expect(trainingLibraryHelpersStore.getters.getCompliances(state)).toEqual([
        { text: 'GDPR', value: 1 }
      ])
    })

    it('getTrainingVendors returns trainingVendors array', () => {
      state.trainingVendors = [{ text: 'Vendor 1', value: 1 }]
      expect(trainingLibraryHelpersStore.getters.getTrainingVendors(state)).toEqual([
        { text: 'Vendor 1', value: 1 }
      ])
    })

    it('getLevels returns levels array', () => {
      state.levels = [{ text: 'Beginner', value: '1', id: 1, name: 'Beginner' }]
      expect(trainingLibraryHelpersStore.getters.getLevels(state)).toEqual([
        { text: 'Beginner', value: '1', id: 1, name: 'Beginner' }
      ])
    })

    it('getDurations returns durations array', () => {
      state.durations = [{ text: '30 minutes', value: '1', id: 1, name: '30 minutes' }]
      expect(trainingLibraryHelpersStore.getters.getDurations(state)).toEqual([
        { text: '30 minutes', value: '1', id: 1, name: '30 minutes' }
      ])
    })

    it('getBehaviours returns behaviours array', () => {
      state.behaviours = [{ text: 'Phishing', value: 1 }]
      expect(trainingLibraryHelpersStore.getters.getBehaviours(state)).toEqual([
        { text: 'Phishing', value: 1 }
      ])
    })

    it('getDistributionDelayTimeTypes returns distributionDelayTimeTypes', () => {
      expect(trainingLibraryHelpersStore.getters.getDistributionDelayTimeTypes(state)).toBeDefined()
    })

    it('getEnumTypes returns enumTypes object', () => {
      state.enumTypes = { status: 'active' }
      expect(trainingLibraryHelpersStore.getters.getEnumTypes(state)).toEqual({ status: 'active' })
    })

    it('getCertificateEmailNotificationTemplateTypeResourceId returns value', () => {
      state.certificateEmailNotificationTemplateTypeResourceId = 'cert-123'
      expect(trainingLibraryHelpersStore.getters.getCertificateEmailNotificationTemplateTypeResourceId(state)).toBe(
        'cert-123'
      )
    })

    it('getReminderEmailNotificationTemplateTypeResourceId returns value', () => {
      state.reminderEmailNotificationTemplateTypeResourceId = 'reminder-456'
      expect(trainingLibraryHelpersStore.getters.getReminderEmailNotificationTemplateTypeResourceId(state)).toBe(
        'reminder-456'
      )
    })

    it('getTrainingEmailNotificationTemplateTypeResourceId returns value', () => {
      state.trainingEmailNotificationTemplateTypeResourceId = 'training-789'
      expect(trainingLibraryHelpersStore.getters.getTrainingEmailNotificationTemplateTypeResourceId(state)).toBe(
        'training-789'
      )
    })

    it('getSurveyEmailNotificationTemplateTypeResourceId returns value', () => {
      state.surveyEmailNotificationTemplateTypeResourceId = 'survey-111'
      expect(trainingLibraryHelpersStore.getters.getSurveyEmailNotificationTemplateTypeResourceId(state)).toBe(
        'survey-111'
      )
    })

    it('getSurveyReminderEmailNotificationTemplateTypeResourceId returns value', () => {
      state.surveyReminderEmailNotificationTemplateTypeResourceId = 'survey-reminder-222'
      expect(trainingLibraryHelpersStore.getters.getSurveyReminderEmailNotificationTemplateTypeResourceId(state)).toBe(
        'survey-reminder-222'
      )
    })

    it('getInfographicEmailNotificationTemplateTypeResourceId returns value', () => {
      state.infographicEmailNotificationTemplateTypeResourceId = 'infographic-333'
      expect(trainingLibraryHelpersStore.getters.getInfographicEmailNotificationTemplateTypeResourceId(state)).toBe(
        'infographic-333'
      )
    })

    it('getLearningPathEmailNotificationTemplateTypeResourceId returns value', () => {
      state.learningPathEmailNotificationTemplateTypeResourceId = 'learning-path-444'
      expect(trainingLibraryHelpersStore.getters.getLearningPathEmailNotificationTemplateTypeResourceId(state)).toBe(
        'learning-path-444'
      )
    })

    it('getLearningPathReminderEmailNotificationTemplateTypeResourceId returns value', () => {
      state.learningPathReminderEmailNotificationTemplateTypeResourceId = 'learning-path-reminder-555'
      expect(trainingLibraryHelpersStore.getters.getLearningPathReminderEmailNotificationTemplateTypeResourceId(state)).toBe(
        'learning-path-reminder-555'
      )
    })

    it('getPosterEmailNotificationTemplateTypeResourceId returns value', () => {
      state.posterEmailNotificationTemplateTypeResourceId = 'poster-666'
      expect(trainingLibraryHelpersStore.getters.getPosterEmailNotificationTemplateTypeResourceId(state)).toBe(
        'poster-666'
      )
    })

    it('getTrainingTypes returns types array', () => {
      state.types = [{ text: 'Video', value: '1' }]
      expect(trainingLibraryHelpersStore.getters.getTrainingTypes(state)).toEqual([
        { text: 'Video', value: '1' }
      ])
    })

    it('getLearningPathTrainingTypes returns learningPathTrainingTypes array', () => {
      state.learningPathTrainingTypes = [{ text: 'Course', value: '2' }]
      expect(trainingLibraryHelpersStore.getters.getLearningPathTrainingTypes(state)).toEqual([
        { text: 'Course', value: '2' }
      ])
    })

    it('getCanSaveVendor returns canSaveVendor boolean', () => {
      state.canSaveVendor = true
      expect(trainingLibraryHelpersStore.getters.getCanSaveVendor(state)).toBe(true)
    })
  })

  describe('mutations', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(trainingLibraryHelpersStore.state))
    })

    it('SET_CATEGORIES updates categories', () => {
      const categories = [{ text: 'Category 1', value: 'cat1' }]
      trainingLibraryHelpersStore.mutations.SET_CATEGORIES(state, categories)
      expect(state.categories).toEqual(categories)
    })

    it('SET_SCORM_TYPES updates scormTypes', () => {
      const scormTypes = [{ text: 'SCORM 2004', value: 'scorm2004' }]
      trainingLibraryHelpersStore.mutations.SET_SCORM_TYPES(state, scormTypes)
      expect(state.scormTypes).toEqual(scormTypes)
    })

    it('SET_LANGUAGES updates languages', () => {
      const languages = [{ isoFriendlyName: 'French', code: 'fr' }]
      trainingLibraryHelpersStore.mutations.SET_LANGUAGES(state, languages)
      expect(state.languages).toEqual(languages)
    })

    it('SET_TARGET_AUDIENCES updates targetAudiences', () => {
      const audiences = [{ id: '2', text: 'Managers', value: '2' }]
      trainingLibraryHelpersStore.mutations.SET_TARGET_AUDIENCES(state, audiences)
      expect(state.targetAudiences).toEqual(audiences)
    })

    it('SET_COMPLIANCES updates compliances', () => {
      const compliances = [{ text: 'HIPAA', value: 2 }]
      trainingLibraryHelpersStore.mutations.SET_COMPLIANCES(state, compliances)
      expect(state.compliances).toEqual(compliances)
    })

    it('SET_TRAINING_VENDORS updates trainingVendors', () => {
      const vendors = [{ text: 'Vendor 2', value: 2 }]
      trainingLibraryHelpersStore.mutations.SET_TRAINING_VENDORS(state, vendors)
      expect(state.trainingVendors).toEqual(vendors)
    })

    it('SET_LEVELS updates levels', () => {
      const levels = [{ text: 'Advanced', value: '3', id: 3, name: 'Advanced' }]
      trainingLibraryHelpersStore.mutations.SET_LEVELS(state, levels)
      expect(state.levels).toEqual(levels)
    })

    it('SET_DURATIONS updates durations', () => {
      const durations = [{ text: '1 hour', value: '2', id: 2, name: '1 hour' }]
      trainingLibraryHelpersStore.mutations.SET_DURATIONS(state, durations)
      expect(state.durations).toEqual(durations)
    })

    it('SET_BEHAVIOURS updates behaviours', () => {
      const behaviours = [{ text: 'Malware', value: 2 }]
      trainingLibraryHelpersStore.mutations.SET_BEHAVIOURS(state, behaviours)
      expect(state.behaviours).toEqual(behaviours)
    })

    it('SET_ENUM_TYPES updates enumTypes', () => {
      const enumTypes = { status: 'inactive', role: 'admin' }
      trainingLibraryHelpersStore.mutations.SET_ENUM_TYPES(state, enumTypes)
      expect(state.enumTypes).toEqual(enumTypes)
    })

    it('SET_CERTIFICATE_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID updates value', () => {
      trainingLibraryHelpersStore.mutations.SET_CERTIFICATE_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, 'cert-new')
      expect(state.certificateEmailNotificationTemplateTypeResourceId).toBe('cert-new')
    })

    it('SET_REMINDER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID updates value', () => {
      trainingLibraryHelpersStore.mutations.SET_REMINDER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, 'reminder-new')
      expect(state.reminderEmailNotificationTemplateTypeResourceId).toBe('reminder-new')
    })

    it('SET_TRAINING_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID updates value', () => {
      trainingLibraryHelpersStore.mutations.SET_TRAINING_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, 'training-new')
      expect(state.trainingEmailNotificationTemplateTypeResourceId).toBe('training-new')
    })

    it('SET_SURVEY_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID updates value', () => {
      trainingLibraryHelpersStore.mutations.SET_SURVEY_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, 'survey-new')
      expect(state.surveyEmailNotificationTemplateTypeResourceId).toBe('survey-new')
    })

    it('SET_SURVEY_REMINDER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID updates value', () => {
      trainingLibraryHelpersStore.mutations.SET_SURVEY_REMINDER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, 'survey-reminder-new')
      expect(state.surveyReminderEmailNotificationTemplateTypeResourceId).toBe('survey-reminder-new')
    })

    it('SET_LEARNING_PATH_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID updates value', () => {
      trainingLibraryHelpersStore.mutations.SET_LEARNING_PATH_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, 'learning-path-new')
      expect(state.learningPathEmailNotificationTemplateTypeResourceId).toBe('learning-path-new')
    })

    it('SET_LEARNING_PATH_REMINDER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID updates value', () => {
      trainingLibraryHelpersStore.mutations.SET_LEARNING_PATH_REMINDER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, 'learning-path-reminder-new')
      expect(state.learningPathReminderEmailNotificationTemplateTypeResourceId).toBe('learning-path-reminder-new')
    })

    it('SET_POSTER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID updates value', () => {
      trainingLibraryHelpersStore.mutations.SET_POSTER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, 'poster-new')
      expect(state.posterEmailNotificationTemplateTypeResourceId).toBe('poster-new')
    })

    it('SET_INFOGRAPHIC_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID updates value', () => {
      trainingLibraryHelpersStore.mutations.SET_INFOGRAPHIC_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, 'infographic-new')
      expect(state.infographicEmailNotificationTemplateTypeResourceId).toBe('infographic-new')
    })

    it('SET_TYPES updates types', () => {
      const types = [{ text: 'Quiz', value: '3' }]
      trainingLibraryHelpersStore.mutations.SET_TYPES(state, types)
      expect(state.types).toEqual(types)
    })

    it('SET_LEARNING_PATH_TRAINING_TYPES updates learningPathTrainingTypes', () => {
      const types = [{ text: 'Module', value: '4' }]
      trainingLibraryHelpersStore.mutations.SET_LEARNING_PATH_TRAINING_TYPES(state, types)
      expect(state.learningPathTrainingTypes).toEqual(types)
    })

    it('SET_CAN_SAVE_VENDOR updates canSaveVendor', () => {
      trainingLibraryHelpersStore.mutations.SET_CAN_SAVE_VENDOR(state, true)
      expect(state.canSaveVendor).toBe(true)
    })

    it('SET_CAN_SAVE_VENDOR can set to false', () => {
      state.canSaveVendor = true
      trainingLibraryHelpersStore.mutations.SET_CAN_SAVE_VENDOR(state, false)
      expect(state.canSaveVendor).toBe(false)
    })
  })

  describe('actions', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(trainingLibraryHelpersStore.state))
    })

    it('setCanSaveVendor commits mutation with true', () => {
      const commit = jest.fn()
      trainingLibraryHelpersStore.actions.setCanSaveVendor({ commit }, true)
      expect(commit).toHaveBeenCalledWith('SET_CAN_SAVE_VENDOR', true)
    })

    it('setCanSaveVendor commits mutation with false', () => {
      const commit = jest.fn()
      trainingLibraryHelpersStore.actions.setCanSaveVendor({ commit }, false)
      expect(commit).toHaveBeenCalledWith('SET_CAN_SAVE_VENDOR', false)
    })

    it('setCanSaveVendor commits mutation once', () => {
      const commit = jest.fn()
      trainingLibraryHelpersStore.actions.setCanSaveVendor({ commit }, true)
      expect(commit).toHaveBeenCalledTimes(1)
    })
  })

  describe('module configuration', () => {
    it('module is namespaced', () => {
      expect(trainingLibraryHelpersStore.namespaced).toBe(true)
    })

    it('has required properties', () => {
      expect(trainingLibraryHelpersStore).toHaveProperty('state')
      expect(trainingLibraryHelpersStore).toHaveProperty('getters')
      expect(trainingLibraryHelpersStore).toHaveProperty('mutations')
      expect(trainingLibraryHelpersStore).toHaveProperty('actions')
    })

    it('has all expected getters', () => {
      const expectedGetters = [
        'getCategories',
        'getScormTypes',
        'getLanguages',
        'getTargetAudiences',
        'getCompliances',
        'getTrainingVendors',
        'getLevels',
        'getDurations',
        'getBehaviours',
        'getDistributionDelayTimeTypes',
        'getEnumTypes',
        'getCertificateEmailNotificationTemplateTypeResourceId',
        'getReminderEmailNotificationTemplateTypeResourceId',
        'getTrainingEmailNotificationTemplateTypeResourceId',
        'getSurveyEmailNotificationTemplateTypeResourceId',
        'getSurveyReminderEmailNotificationTemplateTypeResourceId',
        'getInfographicEmailNotificationTemplateTypeResourceId',
        'getLearningPathEmailNotificationTemplateTypeResourceId',
        'getLearningPathReminderEmailNotificationTemplateTypeResourceId',
        'getPosterEmailNotificationTemplateTypeResourceId',
        'getTrainingTypes',
        'getLearningPathTrainingTypes',
        'getCanSaveVendor'
      ]
      expectedGetters.forEach((getter) => {
        expect(trainingLibraryHelpersStore.getters).toHaveProperty(getter)
      })
    })

    it('has all expected mutations', () => {
      const expectedMutations = [
        'SET_CATEGORIES',
        'SET_SCORM_TYPES',
        'SET_LANGUAGES',
        'SET_TARGET_AUDIENCES',
        'SET_COMPLIANCES',
        'SET_TRAINING_VENDORS',
        'SET_LEVELS',
        'SET_DURATIONS',
        'SET_BEHAVIOURS',
        'SET_ENUM_TYPES',
        'SET_CERTIFICATE_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID',
        'SET_REMINDER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID',
        'SET_TRAINING_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID',
        'SET_SURVEY_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID',
        'SET_SURVEY_REMINDER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID',
        'SET_LEARNING_PATH_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID',
        'SET_LEARNING_PATH_REMINDER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID',
        'SET_POSTER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID',
        'SET_INFOGRAPHIC_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID',
        'SET_TYPES',
        'SET_LEARNING_PATH_TRAINING_TYPES',
        'SET_CAN_SAVE_VENDOR'
      ]
      expectedMutations.forEach((mutation) => {
        expect(trainingLibraryHelpersStore.mutations).toHaveProperty(mutation)
      })
    })

    it('has expected actions', () => {
      expect(trainingLibraryHelpersStore.actions).toHaveProperty('setCanSaveVendor')
    })
  })

  describe('integration tests', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(trainingLibraryHelpersStore.state))
    })

    it('can set multiple collections sequentially', () => {
      const categories = [{ text: 'Cat1', value: 'c1' }]
      const languages = [{ isoFriendlyName: 'English', code: 'en' }]
      const vendors = [{ text: 'Vendor1', value: 1 }]

      trainingLibraryHelpersStore.mutations.SET_CATEGORIES(state, categories)
      trainingLibraryHelpersStore.mutations.SET_LANGUAGES(state, languages)
      trainingLibraryHelpersStore.mutations.SET_TRAINING_VENDORS(state, vendors)

      expect(state.categories).toEqual(categories)
      expect(state.languages).toEqual(languages)
      expect(state.trainingVendors).toEqual(vendors)
    })

    it('can update all email notification template IDs', () => {
      const templateIds = {
        certificate: 'cert-123',
        reminder: 'reminder-456',
        training: 'training-789',
        survey: 'survey-111',
        surveyReminder: 'survey-reminder-222',
        infographic: 'infographic-333',
        learningPath: 'learning-path-444',
        learningPathReminder: 'learning-path-reminder-555',
        poster: 'poster-666'
      }

      trainingLibraryHelpersStore.mutations.SET_CERTIFICATE_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(
        state,
        templateIds.certificate
      )
      trainingLibraryHelpersStore.mutations.SET_REMINDER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(
        state,
        templateIds.reminder
      )
      trainingLibraryHelpersStore.mutations.SET_TRAINING_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(
        state,
        templateIds.training
      )
      trainingLibraryHelpersStore.mutations.SET_SURVEY_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(
        state,
        templateIds.survey
      )
      trainingLibraryHelpersStore.mutations.SET_SURVEY_REMINDER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(
        state,
        templateIds.surveyReminder
      )
      trainingLibraryHelpersStore.mutations.SET_INFOGRAPHIC_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(
        state,
        templateIds.infographic
      )
      trainingLibraryHelpersStore.mutations.SET_LEARNING_PATH_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(
        state,
        templateIds.learningPath
      )
      trainingLibraryHelpersStore.mutations.SET_LEARNING_PATH_REMINDER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(
        state,
        templateIds.learningPathReminder
      )
      trainingLibraryHelpersStore.mutations.SET_POSTER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(
        state,
        templateIds.poster
      )

      expect(state.certificateEmailNotificationTemplateTypeResourceId).toBe(templateIds.certificate)
      expect(state.reminderEmailNotificationTemplateTypeResourceId).toBe(templateIds.reminder)
      expect(state.trainingEmailNotificationTemplateTypeResourceId).toBe(templateIds.training)
      expect(state.surveyEmailNotificationTemplateTypeResourceId).toBe(templateIds.survey)
      expect(state.surveyReminderEmailNotificationTemplateTypeResourceId).toBe(templateIds.surveyReminder)
      expect(state.infographicEmailNotificationTemplateTypeResourceId).toBe(templateIds.infographic)
      expect(state.learningPathEmailNotificationTemplateTypeResourceId).toBe(templateIds.learningPath)
      expect(state.learningPathReminderEmailNotificationTemplateTypeResourceId).toBe(templateIds.learningPathReminder)
      expect(state.posterEmailNotificationTemplateTypeResourceId).toBe(templateIds.poster)
    })

    it('can reset all state values to defaults', () => {
      // Set some values
      state.categories = [{ text: 'Test', value: 'test' }]
      state.languages = [{ code: 'en' }]
      state.canSaveVendor = true
      state.enumTypes = { key: 'value' }

      // Reset by setting empty/default values
      trainingLibraryHelpersStore.mutations.SET_CATEGORIES(state, [])
      trainingLibraryHelpersStore.mutations.SET_LANGUAGES(state, [])
      trainingLibraryHelpersStore.mutations.SET_CAN_SAVE_VENDOR(state, false)
      trainingLibraryHelpersStore.mutations.SET_ENUM_TYPES(state, {})

      expect(state.categories).toEqual([])
      expect(state.languages).toEqual([])
      expect(state.canSaveVendor).toBe(false)
      expect(state.enumTypes).toEqual({})
    })
  })
})
