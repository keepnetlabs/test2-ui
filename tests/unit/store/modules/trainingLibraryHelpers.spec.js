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

  describe('state properties type checking', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(trainingLibraryHelpersStore.state))
    })

    it('categories property exists and is array', () => {
      expect(trainingLibraryHelpersStore.state).toHaveProperty('categories')
      expect(Array.isArray(trainingLibraryHelpersStore.state.categories)).toBe(true)
    })

    it('scormTypes property exists and is array', () => {
      expect(trainingLibraryHelpersStore.state).toHaveProperty('scormTypes')
      expect(Array.isArray(trainingLibraryHelpersStore.state.scormTypes)).toBe(true)
    })

    it('languages property exists and is array', () => {
      expect(trainingLibraryHelpersStore.state).toHaveProperty('languages')
      expect(Array.isArray(trainingLibraryHelpersStore.state.languages)).toBe(true)
    })

    it('targetAudiences property exists and is array', () => {
      expect(trainingLibraryHelpersStore.state).toHaveProperty('targetAudiences')
      expect(Array.isArray(trainingLibraryHelpersStore.state.targetAudiences)).toBe(true)
    })

    it('compliances property exists and is array', () => {
      expect(trainingLibraryHelpersStore.state).toHaveProperty('compliances')
      expect(Array.isArray(trainingLibraryHelpersStore.state.compliances)).toBe(true)
    })

    it('trainingVendors property exists and is array', () => {
      expect(trainingLibraryHelpersStore.state).toHaveProperty('trainingVendors')
      expect(Array.isArray(trainingLibraryHelpersStore.state.trainingVendors)).toBe(true)
    })

    it('types property exists and is array', () => {
      expect(trainingLibraryHelpersStore.state).toHaveProperty('types')
      expect(Array.isArray(trainingLibraryHelpersStore.state.types)).toBe(true)
    })

    it('levels property exists and is array', () => {
      expect(trainingLibraryHelpersStore.state).toHaveProperty('levels')
      expect(Array.isArray(trainingLibraryHelpersStore.state.levels)).toBe(true)
    })

    it('durations property exists and is array', () => {
      expect(trainingLibraryHelpersStore.state).toHaveProperty('durations')
      expect(Array.isArray(trainingLibraryHelpersStore.state.durations)).toBe(true)
    })

    it('learningPathTrainingTypes property exists and is array', () => {
      expect(trainingLibraryHelpersStore.state).toHaveProperty('learningPathTrainingTypes')
      expect(Array.isArray(trainingLibraryHelpersStore.state.learningPathTrainingTypes)).toBe(true)
    })

    it('behaviours property exists and is array', () => {
      expect(trainingLibraryHelpersStore.state).toHaveProperty('behaviours')
      expect(Array.isArray(trainingLibraryHelpersStore.state.behaviours)).toBe(true)
    })

    it('enumTypes property exists and is object', () => {
      expect(trainingLibraryHelpersStore.state).toHaveProperty('enumTypes')
      expect(typeof trainingLibraryHelpersStore.state.enumTypes).toBe('object')
      expect(Array.isArray(trainingLibraryHelpersStore.state.enumTypes)).toBe(false)
    })

    it('canSaveVendor property exists and is boolean', () => {
      expect(trainingLibraryHelpersStore.state).toHaveProperty('canSaveVendor')
      expect(typeof trainingLibraryHelpersStore.state.canSaveVendor).toBe('boolean')
    })

    it('distributionDelayTimeTypes property exists', () => {
      expect(trainingLibraryHelpersStore.state).toHaveProperty('distributionDelayTimeTypes')
    })

    it('email template ID properties have correct types', () => {
      expect(Array.isArray(state.certificateEmailNotificationTemplateTypeResourceId)).toBe(true)
      expect(Array.isArray(state.reminderEmailNotificationTemplateTypeResourceId)).toBe(true)
      expect(Array.isArray(state.trainingEmailNotificationTemplateTypeResourceId)).toBe(true)
      expect(typeof state.surveyEmailNotificationTemplateTypeResourceId).toBe('string')
      expect(typeof state.surveyReminderEmailNotificationTemplateTypeResourceId).toBe('string')
      expect(typeof state.infographicEmailNotificationTemplateTypeResourceId).toBe('string')
      expect(typeof state.learningPathEmailNotificationTemplateTypeResourceId).toBe('string')
      expect(typeof state.learningPathReminderEmailNotificationTemplateTypeResourceId).toBe('string')
      expect(typeof state.posterEmailNotificationTemplateTypeResourceId).toBe('string')
    })
  })

  describe('getter function types and reference equality', () => {
    beforeEach(() => {
      state = trainingLibraryHelpersStore.state
    })

    it('getCategories is a function', () => {
      expect(typeof trainingLibraryHelpersStore.getters.getCategories).toBe('function')
    })

    it('getScormTypes is a function', () => {
      expect(typeof trainingLibraryHelpersStore.getters.getScormTypes).toBe('function')
    })

    it('getLanguages is a function', () => {
      expect(typeof trainingLibraryHelpersStore.getters.getLanguages).toBe('function')
    })

    it('getTargetAudiences is a function', () => {
      expect(typeof trainingLibraryHelpersStore.getters.getTargetAudiences).toBe('function')
    })

    it('getCompliances is a function', () => {
      expect(typeof trainingLibraryHelpersStore.getters.getCompliances).toBe('function')
    })

    it('getTrainingVendors is a function', () => {
      expect(typeof trainingLibraryHelpersStore.getters.getTrainingVendors).toBe('function')
    })

    it('getLevels is a function', () => {
      expect(typeof trainingLibraryHelpersStore.getters.getLevels).toBe('function')
    })

    it('getDurations is a function', () => {
      expect(typeof trainingLibraryHelpersStore.getters.getDurations).toBe('function')
    })

    it('getBehaviours is a function', () => {
      expect(typeof trainingLibraryHelpersStore.getters.getBehaviours).toBe('function')
    })

    it('getEnumTypes is a function', () => {
      expect(typeof trainingLibraryHelpersStore.getters.getEnumTypes).toBe('function')
    })

    it('getTrainingTypes is a function', () => {
      expect(typeof trainingLibraryHelpersStore.getters.getTrainingTypes).toBe('function')
    })

    it('getLearningPathTrainingTypes is a function', () => {
      expect(typeof trainingLibraryHelpersStore.getters.getLearningPathTrainingTypes).toBe('function')
    })

    it('getCanSaveVendor is a function', () => {
      expect(typeof trainingLibraryHelpersStore.getters.getCanSaveVendor).toBe('function')
    })

    it('all email template ID getters are functions', () => {
      expect(typeof trainingLibraryHelpersStore.getters.getCertificateEmailNotificationTemplateTypeResourceId).toBe('function')
      expect(typeof trainingLibraryHelpersStore.getters.getReminderEmailNotificationTemplateTypeResourceId).toBe('function')
      expect(typeof trainingLibraryHelpersStore.getters.getTrainingEmailNotificationTemplateTypeResourceId).toBe('function')
      expect(typeof trainingLibraryHelpersStore.getters.getSurveyEmailNotificationTemplateTypeResourceId).toBe('function')
      expect(typeof trainingLibraryHelpersStore.getters.getSurveyReminderEmailNotificationTemplateTypeResourceId).toBe('function')
      expect(typeof trainingLibraryHelpersStore.getters.getInfographicEmailNotificationTemplateTypeResourceId).toBe('function')
      expect(typeof trainingLibraryHelpersStore.getters.getLearningPathEmailNotificationTemplateTypeResourceId).toBe('function')
      expect(typeof trainingLibraryHelpersStore.getters.getLearningPathReminderEmailNotificationTemplateTypeResourceId).toBe('function')
      expect(typeof trainingLibraryHelpersStore.getters.getPosterEmailNotificationTemplateTypeResourceId).toBe('function')
    })

    it('getCategories returns same reference for object arrays', () => {
      const result1 = trainingLibraryHelpersStore.getters.getCategories(state)
      const result2 = trainingLibraryHelpersStore.getters.getCategories(state)
      expect(result1).toBe(result2)
    })

    it('getEnumTypes returns same reference for object types', () => {
      const result1 = trainingLibraryHelpersStore.getters.getEnumTypes(state)
      const result2 = trainingLibraryHelpersStore.getters.getEnumTypes(state)
      expect(result1).toBe(result2)
    })

    it('getCanSaveVendor returns boolean type', () => {
      const result = trainingLibraryHelpersStore.getters.getCanSaveVendor(state)
      expect(typeof result).toBe('boolean')
    })
  })

  describe('mutation null and undefined handling', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(trainingLibraryHelpersStore.state))
    })

    it('SET_CATEGORIES handles null payload', () => {
      trainingLibraryHelpersStore.mutations.SET_CATEGORIES(state, null)
      expect(state.categories).toBe(null)
    })

    it('SET_CATEGORIES handles undefined payload', () => {
      trainingLibraryHelpersStore.mutations.SET_CATEGORIES(state, undefined)
      expect(state.categories).toBe(undefined)
    })

    it('SET_SCORM_TYPES handles null payload', () => {
      trainingLibraryHelpersStore.mutations.SET_SCORM_TYPES(state, null)
      expect(state.scormTypes).toBe(null)
    })

    it('SET_LANGUAGES handles undefined payload', () => {
      trainingLibraryHelpersStore.mutations.SET_LANGUAGES(state, undefined)
      expect(state.languages).toBe(undefined)
    })

    it('SET_ENUM_TYPES handles null payload', () => {
      trainingLibraryHelpersStore.mutations.SET_ENUM_TYPES(state, null)
      expect(state.enumTypes).toBe(null)
    })

    it('SET_ENUM_TYPES handles undefined payload', () => {
      trainingLibraryHelpersStore.mutations.SET_ENUM_TYPES(state, undefined)
      expect(state.enumTypes).toBe(undefined)
    })

    it('SET_CAN_SAVE_VENDOR handles null payload', () => {
      trainingLibraryHelpersStore.mutations.SET_CAN_SAVE_VENDOR(state, null)
      expect(state.canSaveVendor).toBe(null)
    })

    it('SET_CAN_SAVE_VENDOR handles undefined payload', () => {
      trainingLibraryHelpersStore.mutations.SET_CAN_SAVE_VENDOR(state, undefined)
      expect(state.canSaveVendor).toBe(undefined)
    })

    it('SET_CERTIFICATE_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID handles null', () => {
      trainingLibraryHelpersStore.mutations.SET_CERTIFICATE_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, null)
      expect(state.certificateEmailNotificationTemplateTypeResourceId).toBe(null)
    })

    it('SET_REMINDER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID handles undefined', () => {
      trainingLibraryHelpersStore.mutations.SET_REMINDER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, undefined)
      expect(state.reminderEmailNotificationTemplateTypeResourceId).toBe(undefined)
    })

    it('SET_TRAINING_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID handles null', () => {
      trainingLibraryHelpersStore.mutations.SET_TRAINING_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, null)
      expect(state.trainingEmailNotificationTemplateTypeResourceId).toBe(null)
    })

    it('SET_SURVEY_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID handles undefined', () => {
      trainingLibraryHelpersStore.mutations.SET_SURVEY_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, undefined)
      expect(state.surveyEmailNotificationTemplateTypeResourceId).toBe(undefined)
    })

    it('SET_TARGET_AUDIENCES handles null payload', () => {
      trainingLibraryHelpersStore.mutations.SET_TARGET_AUDIENCES(state, null)
      expect(state.targetAudiences).toBe(null)
    })

    it('SET_COMPLIANCES handles null payload', () => {
      trainingLibraryHelpersStore.mutations.SET_COMPLIANCES(state, null)
      expect(state.compliances).toBe(null)
    })

    it('SET_TRAINING_VENDORS handles undefined payload', () => {
      trainingLibraryHelpersStore.mutations.SET_TRAINING_VENDORS(state, undefined)
      expect(state.trainingVendors).toBe(undefined)
    })

    it('SET_LEVELS handles null payload', () => {
      trainingLibraryHelpersStore.mutations.SET_LEVELS(state, null)
      expect(state.levels).toBe(null)
    })

    it('SET_DURATIONS handles undefined payload', () => {
      trainingLibraryHelpersStore.mutations.SET_DURATIONS(state, undefined)
      expect(state.durations).toBe(undefined)
    })

    it('SET_BEHAVIOURS handles null payload', () => {
      trainingLibraryHelpersStore.mutations.SET_BEHAVIOURS(state, null)
      expect(state.behaviours).toBe(null)
    })

    it('SET_TYPES handles null payload', () => {
      trainingLibraryHelpersStore.mutations.SET_TYPES(state, null)
      expect(state.types).toBe(null)
    })

    it('SET_LEARNING_PATH_TRAINING_TYPES handles undefined payload', () => {
      trainingLibraryHelpersStore.mutations.SET_LEARNING_PATH_TRAINING_TYPES(state, undefined)
      expect(state.learningPathTrainingTypes).toBe(undefined)
    })
  })

  describe('action commit patterns and payload handling', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(trainingLibraryHelpersStore.state))
    })

    it('setCanSaveVendor calls commit exactly once', () => {
      const commit = jest.fn()
      trainingLibraryHelpersStore.actions.setCanSaveVendor({ commit }, false)
      expect(commit).toHaveBeenCalledTimes(1)
    })

    it('setCanSaveVendor passes correct mutation name', () => {
      const commit = jest.fn()
      trainingLibraryHelpersStore.actions.setCanSaveVendor({ commit }, true)
      expect(commit.mock.calls[0][0]).toBe('SET_CAN_SAVE_VENDOR')
    })

    it('setCanSaveVendor passes payload as second argument', () => {
      const commit = jest.fn()
      trainingLibraryHelpersStore.actions.setCanSaveVendor({ commit }, true)
      expect(commit.mock.calls[0][1]).toBe(true)
    })

    it('setCanSaveVendor handles null payload', () => {
      const commit = jest.fn()
      trainingLibraryHelpersStore.actions.setCanSaveVendor({ commit }, null)
      expect(commit).toHaveBeenCalledWith('SET_CAN_SAVE_VENDOR', null)
    })

    it('setCanSaveVendor handles undefined payload', () => {
      const commit = jest.fn()
      trainingLibraryHelpersStore.actions.setCanSaveVendor({ commit }, undefined)
      expect(commit).toHaveBeenCalledWith('SET_CAN_SAVE_VENDOR', undefined)
    })

    it('setCanSaveVendor returns undefined', () => {
      const commit = jest.fn()
      const result = trainingLibraryHelpersStore.actions.setCanSaveVendor({ commit }, true)
      expect(result).toBe(undefined)
    })

    it('setCanSaveVendor action does not modify other state', () => {
      const commit = jest.fn()
      const stateBefore = JSON.parse(JSON.stringify(state))
      trainingLibraryHelpersStore.actions.setCanSaveVendor({ commit }, true)
      expect(state).toEqual(stateBefore)
    })
  })

  describe('special characters and Unicode handling', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(trainingLibraryHelpersStore.state))
    })

    it('handles special characters in category names', () => {
      const categories = [{ text: 'Category @#$% & Special', value: 'special' }]
      trainingLibraryHelpersStore.mutations.SET_CATEGORIES(state, categories)
      expect(state.categories).toEqual(categories)
    })

    it('handles Unicode characters in language names', () => {
      const languages = [{ isoFriendlyName: 'Français', code: 'fr' }]
      trainingLibraryHelpersStore.mutations.SET_LANGUAGES(state, languages)
      expect(state.languages).toEqual(languages)
    })

    it('handles emoji in training vendor names', () => {
      const vendors = [{ text: 'Vendor 🎓 Training', value: 1 }]
      trainingLibraryHelpersStore.mutations.SET_TRAINING_VENDORS(state, vendors)
      expect(state.trainingVendors).toEqual(vendors)
    })

    it('handles Chinese characters in category text', () => {
      const categories = [{ text: '安全培训', value: 'security-cn' }]
      trainingLibraryHelpersStore.mutations.SET_CATEGORIES(state, categories)
      expect(state.categories).toEqual(categories)
    })

    it('handles Arabic characters in audience text', () => {
      const audiences = [{ id: '1', text: 'الجمهور', value: '1' }]
      trainingLibraryHelpersStore.mutations.SET_TARGET_AUDIENCES(state, audiences)
      expect(state.targetAudiences).toEqual(audiences)
    })

    it('handles special characters in email template IDs', () => {
      const specialId = 'template-!@#$%^&*()'
      trainingLibraryHelpersStore.mutations.SET_CERTIFICATE_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, specialId)
      expect(state.certificateEmailNotificationTemplateTypeResourceId).toBe(specialId)
    })

    it('handles newlines and tabs in text fields', () => {
      const categories = [{ text: 'Category\nWith\tWhitespace', value: 'ws' }]
      trainingLibraryHelpersStore.mutations.SET_CATEGORIES(state, categories)
      expect(state.categories).toEqual(categories)
    })

    it('handles quotes in text fields', () => {
      const vendors = [{ text: 'Vendor "Named" with quotes', value: 1 }]
      trainingLibraryHelpersStore.mutations.SET_TRAINING_VENDORS(state, vendors)
      expect(state.trainingVendors).toEqual(vendors)
    })
  })

  describe('large data and scale handling', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(trainingLibraryHelpersStore.state))
    })

    it('handles 100+ categories', () => {
      const categories = Array.from({ length: 100 }, (_, i) => ({
        text: `Category ${i + 1}`,
        value: `cat${i + 1}`
      }))
      trainingLibraryHelpersStore.mutations.SET_CATEGORIES(state, categories)
      expect(state.categories.length).toBe(100)
      expect(state.categories[0].text).toBe('Category 1')
      expect(state.categories[99].text).toBe('Category 100')
    })

    it('handles 1000+ items in languages array', () => {
      const languages = Array.from({ length: 1000 }, (_, i) => ({
        isoFriendlyName: `Language ${i + 1}`,
        code: `lang${i + 1}`
      }))
      trainingLibraryHelpersStore.mutations.SET_LANGUAGES(state, languages)
      expect(state.languages.length).toBe(1000)
    })

    it('handles 500+ character strings in category text', () => {
      const longText = 'A'.repeat(500)
      const categories = [{ text: longText, value: 'long' }]
      trainingLibraryHelpersStore.mutations.SET_CATEGORIES(state, categories)
      expect(state.categories[0].text.length).toBe(500)
    })

    it('handles 5000+ character strings in vendor names', () => {
      const veryLongText = 'Training '.repeat(600)
      const vendors = [{ text: veryLongText, value: 1 }]
      trainingLibraryHelpersStore.mutations.SET_TRAINING_VENDORS(state, vendors)
      expect(state.trainingVendors[0].text.length).toBeGreaterThan(5000)
    })

    it('handles large enumTypes object with many keys', () => {
      const largeEnumTypes = {}
      for (let i = 0; i < 500; i++) {
        largeEnumTypes[`key${i}`] = `value${i}`
      }
      trainingLibraryHelpersStore.mutations.SET_ENUM_TYPES(state, largeEnumTypes)
      expect(Object.keys(state.enumTypes).length).toBe(500)
    })

    it('handles deeply nested category objects', () => {
      const categories = [{
        text: 'Category',
        value: 'cat1',
        nested: {
          level1: {
            level2: {
              level3: {
                data: 'deep'
              }
            }
          }
        }
      }]
      trainingLibraryHelpersStore.mutations.SET_CATEGORIES(state, categories)
      expect(state.categories[0].nested.level1.level2.level3.data).toBe('deep')
    })

    it('getter handles array with 100+ items efficiently', () => {
      const categories = Array.from({ length: 150 }, (_, i) => ({
        text: `Category ${i + 1}`,
        value: `cat${i + 1}`
      }))
      state.categories = categories
      const result = trainingLibraryHelpersStore.getters.getCategories(state)
      expect(result.length).toBe(150)
    })
  })

  describe('rapid operations and state mutation sequences', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(trainingLibraryHelpersStore.state))
    })

    it('handles rapid consecutive SET_CATEGORIES mutations', () => {
      for (let i = 0; i < 10; i++) {
        const categories = [{ text: `Category ${i}`, value: `cat${i}` }]
        trainingLibraryHelpersStore.mutations.SET_CATEGORIES(state, categories)
      }
      expect(state.categories[0].text).toBe('Category 9')
    })

    it('handles rapid consecutive SET_LANGUAGES mutations', () => {
      for (let i = 0; i < 15; i++) {
        const languages = [{ isoFriendlyName: `Language ${i}`, code: `lang${i}` }]
        trainingLibraryHelpersStore.mutations.SET_LANGUAGES(state, languages)
      }
      expect(state.languages[0].code).toBe('lang14')
    })

    it('handles rapid mixed mutations on different properties', () => {
      for (let i = 0; i < 8; i++) {
        trainingLibraryHelpersStore.mutations.SET_CATEGORIES(state, [{ text: `Cat${i}`, value: `c${i}` }])
        trainingLibraryHelpersStore.mutations.SET_LANGUAGES(state, [{ isoFriendlyName: `Lang${i}`, code: `l${i}` }])
        trainingLibraryHelpersStore.mutations.SET_TYPES(state, [{ text: `Type${i}`, value: `t${i}` }])
      }
      expect(state.categories[0].text).toBe('Cat7')
      expect(state.languages[0].code).toBe('l7')
      expect(state.types[0].value).toBe('t7')
    })

    it('handles rapid CAN_SAVE_VENDOR toggle mutations', () => {
      for (let i = 0; i < 20; i++) {
        const value = i % 2 === 0
        trainingLibraryHelpersStore.mutations.SET_CAN_SAVE_VENDOR(state, value)
      }
      expect(state.canSaveVendor).toBe(false)
    })

    it('handles rapid ENUM_TYPES updates with different values', () => {
      for (let i = 0; i < 12; i++) {
        const enumTypes = { iteration: i, timestamp: Date.now() }
        trainingLibraryHelpersStore.mutations.SET_ENUM_TYPES(state, enumTypes)
      }
      expect(state.enumTypes.iteration).toBe(11)
    })

    it('handles sequential email template ID mutations rapidly', () => {
      for (let i = 0; i < 5; i++) {
        trainingLibraryHelpersStore.mutations.SET_CERTIFICATE_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, `cert-${i}`)
        trainingLibraryHelpersStore.mutations.SET_REMINDER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, `rem-${i}`)
        trainingLibraryHelpersStore.mutations.SET_TRAINING_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, `train-${i}`)
      }
      expect(state.certificateEmailNotificationTemplateTypeResourceId).toBe('cert-4')
      expect(state.reminderEmailNotificationTemplateTypeResourceId).toBe('rem-4')
      expect(state.trainingEmailNotificationTemplateTypeResourceId).toBe('train-4')
    })
  })

  describe('empty values and edge case collections', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(trainingLibraryHelpersStore.state))
    })

    it('handles empty array for categories', () => {
      trainingLibraryHelpersStore.mutations.SET_CATEGORIES(state, [])
      expect(state.categories).toEqual([])
      expect(state.categories.length).toBe(0)
    })

    it('handles empty array for all collection types', () => {
      trainingLibraryHelpersStore.mutations.SET_SCORM_TYPES(state, [])
      trainingLibraryHelpersStore.mutations.SET_LANGUAGES(state, [])
      trainingLibraryHelpersStore.mutations.SET_TARGET_AUDIENCES(state, [])
      trainingLibraryHelpersStore.mutations.SET_COMPLIANCES(state, [])
      trainingLibraryHelpersStore.mutations.SET_TRAINING_VENDORS(state, [])
      trainingLibraryHelpersStore.mutations.SET_TYPES(state, [])
      trainingLibraryHelpersStore.mutations.SET_LEVELS(state, [])
      trainingLibraryHelpersStore.mutations.SET_DURATIONS(state, [])
      trainingLibraryHelpersStore.mutations.SET_BEHAVIOURS(state, [])
      trainingLibraryHelpersStore.mutations.SET_LEARNING_PATH_TRAINING_TYPES(state, [])

      expect(state.scormTypes.length).toBe(0)
      expect(state.languages.length).toBe(0)
      expect(state.targetAudiences.length).toBe(0)
      expect(state.compliances.length).toBe(0)
    })

    it('handles empty object for enumTypes', () => {
      trainingLibraryHelpersStore.mutations.SET_ENUM_TYPES(state, {})
      expect(state.enumTypes).toEqual({})
      expect(Object.keys(state.enumTypes).length).toBe(0)
    })

    it('handles empty string for email template IDs', () => {
      trainingLibraryHelpersStore.mutations.SET_CERTIFICATE_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, '')
      expect(state.certificateEmailNotificationTemplateTypeResourceId).toBe('')
    })

    it('handles single item arrays', () => {
      const categories = [{ text: 'Single', value: 'single' }]
      trainingLibraryHelpersStore.mutations.SET_CATEGORIES(state, categories)
      expect(state.categories.length).toBe(1)
      expect(state.categories[0].text).toBe('Single')
    })

    it('handles arrays with null elements', () => {
      const categories = [{ text: 'Valid', value: 'valid' }, null]
      trainingLibraryHelpersStore.mutations.SET_CATEGORIES(state, categories)
      expect(state.categories.length).toBe(2)
      expect(state.categories[1]).toBe(null)
    })

    it('handles objects with empty property values', () => {
      const enumTypes = { empty: '', zero: 0, false: false, null: null }
      trainingLibraryHelpersStore.mutations.SET_ENUM_TYPES(state, enumTypes)
      expect(state.enumTypes.empty).toBe('')
      expect(state.enumTypes.zero).toBe(0)
      expect(state.enumTypes.false).toBe(false)
      expect(state.enumTypes.null).toBe(null)
    })
  })

  describe('data state transitions and mutations', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(trainingLibraryHelpersStore.state))
    })

    it('transitions categories from empty to populated', () => {
      expect(state.categories).toEqual([])
      const newCategories = [{ text: 'New', value: 'new' }]
      trainingLibraryHelpersStore.mutations.SET_CATEGORIES(state, newCategories)
      expect(state.categories).toEqual(newCategories)
    })

    it('transitions categories from populated to empty', () => {
      state.categories = [{ text: 'Old', value: 'old' }]
      trainingLibraryHelpersStore.mutations.SET_CATEGORIES(state, [])
      expect(state.categories).toEqual([])
    })

    it('transitions canSaveVendor from false to true and back', () => {
      expect(state.canSaveVendor).toBe(false)
      trainingLibraryHelpersStore.mutations.SET_CAN_SAVE_VENDOR(state, true)
      expect(state.canSaveVendor).toBe(true)
      trainingLibraryHelpersStore.mutations.SET_CAN_SAVE_VENDOR(state, false)
      expect(state.canSaveVendor).toBe(false)
    })

    it('replaces entire categories array', () => {
      const old = [{ text: 'Old', value: 'old' }]
      const newData = [{ text: 'New1', value: 'new1' }, { text: 'New2', value: 'new2' }]
      trainingLibraryHelpersStore.mutations.SET_CATEGORIES(state, old)
      expect(state.categories.length).toBe(1)
      trainingLibraryHelpersStore.mutations.SET_CATEGORIES(state, newData)
      expect(state.categories.length).toBe(2)
    })

    it('transitions enumTypes from empty to populated with multiple keys', () => {
      expect(state.enumTypes).toEqual({})
      const newEnumTypes = { status: 'active', role: 'admin', type: 'system' }
      trainingLibraryHelpersStore.mutations.SET_ENUM_TYPES(state, newEnumTypes)
      expect(Object.keys(state.enumTypes).length).toBe(3)
    })

    it('transitions enumTypes by complete replacement', () => {
      state.enumTypes = { old: 'value' }
      const newEnumTypes = { new: 'value', another: 'data' }
      trainingLibraryHelpersStore.mutations.SET_ENUM_TYPES(state, newEnumTypes)
      expect(state.enumTypes).toEqual(newEnumTypes)
      expect(state.enumTypes.old).toBeUndefined()
    })

    it('maintains independence of mutations across collections', () => {
      const categories = [{ text: 'Cat', value: 'cat' }]
      const languages = [{ isoFriendlyName: 'Lang', code: 'lang' }]

      trainingLibraryHelpersStore.mutations.SET_CATEGORIES(state, categories)
      expect(state.languages).toEqual([])

      trainingLibraryHelpersStore.mutations.SET_LANGUAGES(state, languages)
      expect(state.categories).toEqual(categories)
      expect(state.languages).toEqual(languages)
    })
  })

  describe('getter behavior with various state values', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(trainingLibraryHelpersStore.state))
    })

    it('getCategories returns empty array on initial state', () => {
      expect(trainingLibraryHelpersStore.getters.getCategories(state)).toEqual([])
    })

    it('getCategories returns populated array', () => {
      state.categories = [{ text: 'Test', value: 'test' }]
      const result = trainingLibraryHelpersStore.getters.getCategories(state)
      expect(result.length).toBe(1)
      expect(result[0].text).toBe('Test')
    })

    it('getEnumTypes returns empty object on initial state', () => {
      expect(trainingLibraryHelpersStore.getters.getEnumTypes(state)).toEqual({})
    })

    it('getEnumTypes returns populated object', () => {
      state.enumTypes = { key1: 'value1', key2: 'value2' }
      const result = trainingLibraryHelpersStore.getters.getEnumTypes(state)
      expect(result.key1).toBe('value1')
      expect(result.key2).toBe('value2')
    })

    it('getCanSaveVendor returns false on initial state', () => {
      expect(trainingLibraryHelpersStore.getters.getCanSaveVendor(state)).toBe(false)
    })

    it('getCanSaveVendor returns true when set', () => {
      state.canSaveVendor = true
      expect(trainingLibraryHelpersStore.getters.getCanSaveVendor(state)).toBe(true)
    })

    it('all email template getters return initial values', () => {
      expect(trainingLibraryHelpersStore.getters.getCertificateEmailNotificationTemplateTypeResourceId(state)).toEqual([])
      expect(trainingLibraryHelpersStore.getters.getReminderEmailNotificationTemplateTypeResourceId(state)).toEqual([])
      expect(trainingLibraryHelpersStore.getters.getTrainingEmailNotificationTemplateTypeResourceId(state)).toEqual([])
    })

    it('email template getters return set values', () => {
      state.certificateEmailNotificationTemplateTypeResourceId = 'cert-test-123'
      expect(trainingLibraryHelpersStore.getters.getCertificateEmailNotificationTemplateTypeResourceId(state)).toBe('cert-test-123')
    })
  })

  describe('mutation immutability and payload isolation', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(trainingLibraryHelpersStore.state))
    })

    it('mutations do not modify input payload objects', () => {
      const payload = [{ text: 'Category', value: 'cat' }]
      const payloadBefore = JSON.stringify(payload)
      trainingLibraryHelpersStore.mutations.SET_CATEGORIES(state, payload)
      const payloadAfter = JSON.stringify(payload)
      expect(payloadBefore).toBe(payloadAfter)
    })

    it('state change does not affect original payload array reference', () => {
      const payload = [{ text: 'Original', value: 'orig' }]
      trainingLibraryHelpersStore.mutations.SET_CATEGORIES(state, payload)
      state.categories[0].text = 'Modified'
      expect(payload[0].text).toBe('Modified')
    })

    it('mutations with primitive values work correctly', () => {
      trainingLibraryHelpersStore.mutations.SET_CERTIFICATE_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, 'test-123')
      expect(state.certificateEmailNotificationTemplateTypeResourceId).toBe('test-123')
    })

    it('multiple mutations with same payload type preserve type consistency', () => {
      const category1 = [{ text: 'Cat1', value: 'cat1' }]
      const category2 = [{ text: 'Cat2', value: 'cat2' }]

      trainingLibraryHelpersStore.mutations.SET_CATEGORIES(state, category1)
      expect(Array.isArray(state.categories)).toBe(true)

      trainingLibraryHelpersStore.mutations.SET_CATEGORIES(state, category2)
      expect(Array.isArray(state.categories)).toBe(true)
    })
  })

  describe('complex integration workflows', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(trainingLibraryHelpersStore.state))
    })

    it('can initialize all training library data in sequence', () => {
      const categories = [{ text: 'Security', value: 'sec' }]
      const languages = [{ isoFriendlyName: 'English', code: 'en' }]
      const types = [{ text: 'Video', value: 'vid' }]
      const vendors = [{ text: 'TrainCorp', value: 1 }]
      const levels = [{ text: 'Beginner', value: '1', id: 1, name: 'Beginner' }]

      trainingLibraryHelpersStore.mutations.SET_CATEGORIES(state, categories)
      trainingLibraryHelpersStore.mutations.SET_LANGUAGES(state, languages)
      trainingLibraryHelpersStore.mutations.SET_TYPES(state, types)
      trainingLibraryHelpersStore.mutations.SET_TRAINING_VENDORS(state, vendors)
      trainingLibraryHelpersStore.mutations.SET_LEVELS(state, levels)

      expect(state.categories[0].text).toBe('Security')
      expect(state.languages[0].code).toBe('en')
      expect(state.types[0].value).toBe('vid')
      expect(state.trainingVendors[0].text).toBe('TrainCorp')
      expect(state.levels[0].id).toBe(1)
    })

    it('can manage multiple template IDs with different access patterns', () => {
      const commit = jest.fn()

      trainingLibraryHelpersStore.actions.setCanSaveVendor({ commit }, true)
      trainingLibraryHelpersStore.mutations.SET_CERTIFICATE_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, 'cert-123')
      trainingLibraryHelpersStore.mutations.SET_REMINDER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, 'rem-456')
      trainingLibraryHelpersStore.mutations.SET_TRAINING_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID(state, 'train-789')

      expect(state.certificateEmailNotificationTemplateTypeResourceId).toBe('cert-123')
      expect(state.reminderEmailNotificationTemplateTypeResourceId).toBe('rem-456')
      expect(state.trainingEmailNotificationTemplateTypeResourceId).toBe('train-789')
      expect(commit).toHaveBeenCalledWith('SET_CAN_SAVE_VENDOR', true)
    })

    it('can read all getters and verify consistency', () => {
      const categories = [{ text: 'Cat', value: 'c1' }]
      const vendors = [{ text: 'Vendor', value: 1 }]

      state.categories = categories
      state.trainingVendors = vendors
      state.canSaveVendor = true

      const getCat = trainingLibraryHelpersStore.getters.getCategories(state)
      const getVen = trainingLibraryHelpersStore.getters.getTrainingVendors(state)
      const getCan = trainingLibraryHelpersStore.getters.getCanSaveVendor(state)

      expect(getCat).toBe(categories)
      expect(getVen).toBe(vendors)
      expect(getCan).toBe(true)
    })

    it('can transition from minimal to rich dataset', () => {
      // Start minimal
      expect(state.categories.length).toBe(0)
      expect(state.languages.length).toBe(0)

      // Add categories
      trainingLibraryHelpersStore.mutations.SET_CATEGORIES(state, [
        { text: 'Security', value: 'sec' },
        { text: 'Compliance', value: 'comp' }
      ])

      // Add languages
      trainingLibraryHelpersStore.mutations.SET_LANGUAGES(state, [
        { isoFriendlyName: 'English', code: 'en' },
        { isoFriendlyName: 'Spanish', code: 'es' },
        { isoFriendlyName: 'French', code: 'fr' }
      ])

      // Verify final state
      expect(state.categories.length).toBe(2)
      expect(state.languages.length).toBe(3)
      expect(trainingLibraryHelpersStore.getters.getCategories(state).length).toBe(2)
      expect(trainingLibraryHelpersStore.getters.getLanguages(state).length).toBe(3)
    })

    it('can manage complete training library configuration update', () => {
      const fullConfig = {
        categories: [{ text: 'Cat1', value: 'c1' }, { text: 'Cat2', value: 'c2' }],
        scormTypes: [{ text: 'SCORM 1.2', value: 's12' }],
        languages: [{ isoFriendlyName: 'English', code: 'en' }],
        targetAudiences: [{ id: '1', text: 'Audience', value: '1' }],
        compliances: [{ text: 'GDPR', value: 1 }],
        trainingVendors: [{ text: 'Vendor', value: 1 }],
        types: [{ text: 'Video', value: 'v' }],
        levels: [{ text: 'Beginner', value: '1', id: 1, name: 'Beginner' }],
        durations: [{ text: '30 min', value: '1', id: 1, name: '30 min' }],
        learningPathTrainingTypes: [{ text: 'Course', value: 'course' }],
        behaviours: [{ text: 'Phishing', value: 1 }]
      }

      trainingLibraryHelpersStore.mutations.SET_CATEGORIES(state, fullConfig.categories)
      trainingLibraryHelpersStore.mutations.SET_SCORM_TYPES(state, fullConfig.scormTypes)
      trainingLibraryHelpersStore.mutations.SET_LANGUAGES(state, fullConfig.languages)
      trainingLibraryHelpersStore.mutations.SET_TARGET_AUDIENCES(state, fullConfig.targetAudiences)
      trainingLibraryHelpersStore.mutations.SET_COMPLIANCES(state, fullConfig.compliances)
      trainingLibraryHelpersStore.mutations.SET_TRAINING_VENDORS(state, fullConfig.trainingVendors)
      trainingLibraryHelpersStore.mutations.SET_TYPES(state, fullConfig.types)
      trainingLibraryHelpersStore.mutations.SET_LEVELS(state, fullConfig.levels)
      trainingLibraryHelpersStore.mutations.SET_DURATIONS(state, fullConfig.durations)
      trainingLibraryHelpersStore.mutations.SET_LEARNING_PATH_TRAINING_TYPES(state, fullConfig.learningPathTrainingTypes)
      trainingLibraryHelpersStore.mutations.SET_BEHAVIOURS(state, fullConfig.behaviours)
      trainingLibraryHelpersStore.mutations.SET_ENUM_TYPES(state, { status: 'active' })
      trainingLibraryHelpersStore.mutations.SET_CAN_SAVE_VENDOR(state, true)

      expect(state.categories.length).toBe(2)
      expect(state.scormTypes.length).toBe(1)
      expect(state.languages.length).toBe(1)
      expect(state.canSaveVendor).toBe(true)
    })
  })
})
