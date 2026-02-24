jest.mock('@/api/awarenessEducator', () => ({
  getCategories: jest.fn(),
  getScormTypes: jest.fn(),
  getLanguages: jest.fn(),
  getTargetAudiences: jest.fn(),
  getCompliances: jest.fn(),
  getVendors: jest.fn(),
  getTrainingLevels: jest.fn(),
  getTrainingDurations: jest.fn(),
  getBehaviours: jest.fn(),
  getTrainingTypes: jest.fn(),
  getEnrollmentFormDetails: jest.fn()
}))

jest.mock('@/api/scenarios', () => ({
  getScenarioDataDetails: jest.fn()
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  __esModule: true,
  default: {
    getSingle: jest.fn()
  }
}))

import trainingLibraryHelpers from '@/store/modules/trainingLibraryHelpers'
import AwarenessEducatorService from '@/api/awarenessEducator'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import { getScenarioDataDetails } from '@/api/scenarios'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

describe('trainingLibraryHelpers store module (extra coverage)', () => {
  let commit
  let dispatch

  beforeEach(() => {
    jest.clearAllMocks()
    commit = jest.fn()
    dispatch = jest.fn()
  })

  describe('callForTrainingHelpers', () => {
    it('dispatches all helper actions', async () => {
      await trainingLibraryHelpers.actions.callForTrainingHelpers({ dispatch })

      expect(dispatch).toHaveBeenCalledWith('callForFormDetails')
      expect(dispatch).toHaveBeenCalledWith('callForScenarioFormDetails')
      expect(dispatch).toHaveBeenCalledWith('callForCategories')
      expect(dispatch).toHaveBeenCalledWith('callForScormTypes')
      expect(dispatch).toHaveBeenCalledWith('callForLanguages')
      expect(dispatch).toHaveBeenCalledWith('callForTargetAudiences')
      expect(dispatch).toHaveBeenCalledWith('callForCompliances')
      expect(dispatch).toHaveBeenCalledWith('callForTrainingVendors')
      expect(dispatch).toHaveBeenCalledWith('callForLevels')
      expect(dispatch).toHaveBeenCalledWith('callForDurations')
      expect(dispatch).toHaveBeenCalledWith('callForBehaviours')
      expect(dispatch).toHaveBeenCalledWith('callForTypes')
    })
  })

  describe('callForScormTypes', () => {
    it('maps scorm types and commits', async () => {
      AwarenessEducatorService.getScormTypes.mockResolvedValue({
        data: {
          data: [
            { name: 'SCORM12', displayName: 'SCORM 1.2' },
            { name: 'SCORM2004', displayName: 'SCORM 2004' }
          ]
        }
      })

      await trainingLibraryHelpers.actions.callForScormTypes({ commit })

      expect(commit).toHaveBeenCalledWith('SET_SCORM_TYPES', [
        { text: 'SCORM 1.2', value: 'SCORM12' },
        { text: 'SCORM 2004', value: 'SCORM2004' }
      ])
    })

    it('handles empty response', async () => {
      AwarenessEducatorService.getScormTypes.mockResolvedValue({ data: { data: [] } })

      await trainingLibraryHelpers.actions.callForScormTypes({ commit })

      expect(commit).toHaveBeenCalledWith('SET_SCORM_TYPES', [])
    })

    it('handles null/undefined data', async () => {
      AwarenessEducatorService.getScormTypes.mockResolvedValue({ data: {} })

      await trainingLibraryHelpers.actions.callForScormTypes({ commit })

      expect(commit).toHaveBeenCalledWith('SET_SCORM_TYPES', [])
    })
  })

  describe('callForTargetAudiences', () => {
    it('maps target audiences with id/roleId/resourceId/targetAudienceId', async () => {
      AwarenessEducatorService.getTargetAudiences.mockResolvedValue({
        data: {
          data: [
            { id: 1, displayName: 'All Users' },
            { roleId: 2, displayName: 'Managers' },
            { resourceId: 'r3', displayName: 'IT' },
            { targetAudienceId: 4, displayName: 'Executives' }
          ]
        }
      })

      await trainingLibraryHelpers.actions.callForTargetAudiences({ commit, dispatch })

      expect(commit).toHaveBeenCalledWith('SET_TARGET_AUDIENCES', [
        { id: 1, text: 'All Users', value: '1' },
        { id: 2, text: 'Managers', value: '2' },
        { id: 'r3', text: 'IT', value: 'r3' },
        { id: 4, text: 'Executives', value: '4' }
      ])
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setFilterItems',
        { key: PROPERTY_STORE.TARGET_AUDIENCE, items: expect.any(Array) },
        { root: true }
      )
      expect(dispatch).toHaveBeenCalledWith(
        'learningPath/setLearningPathFilterItems',
        { key: PROPERTY_STORE.TARGET_AUDIENCE, items: expect.any(Array) },
        { root: true }
      )
    })

    it('handles null id with empty string value', async () => {
      AwarenessEducatorService.getTargetAudiences.mockResolvedValue({
        data: { data: [{ displayName: 'No ID', id: null }] }
      })

      await trainingLibraryHelpers.actions.callForTargetAudiences({ commit, dispatch })

      const call = commit.mock.calls[0]
      expect(call[0]).toBe('SET_TARGET_AUDIENCES')
      expect(call[1][0].text).toBe('No ID')
      expect(call[1][0].value).toBe('')
    })
  })

  describe('mapping fallback branches', () => {
    it('callForCategories falls back to category.name when displayName is missing', async () => {
      AwarenessEducatorService.getCategories.mockResolvedValue({
        data: { data: [{ name: 'OnlyNameCategory' }] }
      })

      await trainingLibraryHelpers.actions.callForCategories({ commit, dispatch })

      expect(commit).toHaveBeenCalledWith('SET_CATEGORIES', [
        { text: 'OnlyNameCategory', value: 'OnlyNameCategory' }
      ])
    })

    it('callForLevels uses levelId fallback and name as text when displayName is missing', async () => {
      AwarenessEducatorService.getTrainingLevels.mockResolvedValue({
        data: {
          data: [{ levelId: 9, name: 'Expert-Level' }]
        }
      })

      await trainingLibraryHelpers.actions.callForLevels({ commit, dispatch })

      expect(commit).toHaveBeenCalledWith('SET_LEVELS', [
        { id: 9, name: 'Expert-Level', text: 'Expert-Level', value: '' }
      ])
    })

    it('callForDurations uses durationId fallback and name as text when displayName missing', async () => {
      AwarenessEducatorService.getTrainingDurations.mockResolvedValue({
        data: {
          data: [{ durationId: 11, name: '11 min' }]
        }
      })

      await trainingLibraryHelpers.actions.callForDurations({ commit, dispatch })

      expect(commit).toHaveBeenCalledWith('SET_DURATIONS', [
        { id: 11, name: '11 min', text: '11 min', value: '' }
      ])
    })
  })

  describe('callForCompliances', () => {
    it('maps compliances and dispatches filter items', async () => {
      AwarenessEducatorService.getCompliances.mockResolvedValue({
        data: {
          data: [
            { id: 1, name: 'GDPR' },
            { id: 2, name: 'ISO27001' }
          ]
        }
      })

      await trainingLibraryHelpers.actions.callForCompliances({ commit, dispatch })

      expect(commit).toHaveBeenCalledWith('SET_COMPLIANCES', [
        { text: 'GDPR', value: 1 },
        { text: 'ISO27001', value: 2 }
      ])
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setFilterItems',
        { key: PROPERTY_STORE.COMPLIANCE, items: expect.any(Array) },
        { root: true }
      )
      expect(dispatch).toHaveBeenCalledWith(
        'learningPath/setLearningPathFilterItems',
        { key: PROPERTY_STORE.COMPLIANCE, items: expect.any(Array) },
        { root: true }
      )
    })
  })

  describe('callForTrainingVendors', () => {
    it('maps vendors and dispatches filter items', async () => {
      AwarenessEducatorService.getVendors.mockResolvedValue({
        data: {
          data: [
            { id: 1, name: 'Vendor A' },
            { id: 2, name: 'Vendor B' }
          ]
        }
      })

      await trainingLibraryHelpers.actions.callForTrainingVendors({ commit, dispatch })

      expect(commit).toHaveBeenCalledWith('SET_TRAINING_VENDORS', [
        { text: 'Vendor A', value: 1 },
        { text: 'Vendor B', value: 2 }
      ])
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setFilterItems',
        { key: PROPERTY_STORE.VENDOR, items: expect.any(Array) },
        { root: true }
      )
      expect(dispatch).toHaveBeenCalledWith(
        'learningPath/setLearningPathFilterItems',
        { key: PROPERTY_STORE.VENDOR, items: expect.any(Array) },
        { root: true }
      )
    })
  })

  describe('callForBehaviours', () => {
    it('maps behaviours and dispatches filter items', async () => {
      AwarenessEducatorService.getBehaviours.mockResolvedValue({
        data: {
          data: [
            { id: 1, name: 'Clicked' },
            { id: 2, name: 'Reported' }
          ]
        }
      })

      await trainingLibraryHelpers.actions.callForBehaviours({ commit, dispatch })

      expect(commit).toHaveBeenCalledWith('SET_BEHAVIOURS', [
        { text: 'Clicked', value: 1 },
        { text: 'Reported', value: 2 }
      ])
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setFilterItems',
        { key: PROPERTY_STORE.BEHAVIOURS, items: expect.any(Array) },
        { root: true }
      )
      expect(dispatch).toHaveBeenCalledWith(
        'learningPath/setLearningPathFilterItems',
        { key: PROPERTY_STORE.BEHAVIOURS, items: expect.any(Array) },
        { root: true }
      )
    })
  })

  describe('callForScenarioFormDetails', () => {
    const flushPromises = () => new Promise((resolve) => setImmediate(resolve))

    it('sets preferred language types from lookup and scenario data', async () => {
      const languageOptions = [
        { resourceId: 'r1', isoFriendlyName: 'English', name: 'English' }
      ]
      LookupLocalStorage.getSingle.mockResolvedValue(languageOptions)
      getScenarioDataDetails.mockResolvedValue({
        data: {
          data: {
            preferredLanguageTypes: [{ value: 'r1' }]
          }
        }
      })

      trainingLibraryHelpers.actions.callForScenarioFormDetails({ commit })
      await flushPromises()

      expect(LookupLocalStorage.getSingle).toHaveBeenCalledWith(21)
      expect(getScenarioDataDetails).toHaveBeenCalled()
      expect(commit).toHaveBeenCalledWith('SET_PREFERRED_LANGUAGE_TYPES', [
        { text: 'English', value: 'r1' }
      ])
    })

    it('commits empty array on lookup catch', async () => {
      LookupLocalStorage.getSingle.mockRejectedValue(new Error('Lookup failed'))

      trainingLibraryHelpers.actions.callForScenarioFormDetails({ commit })
      await flushPromises()

      expect(commit).toHaveBeenCalledWith('SET_PREFERRED_LANGUAGE_TYPES', [])
    })

    it('handles empty preferredLanguageTypes', async () => {
      LookupLocalStorage.getSingle.mockResolvedValue([])
      getScenarioDataDetails.mockResolvedValue({
        data: { data: { preferredLanguageTypes: [] } }
      })

      trainingLibraryHelpers.actions.callForScenarioFormDetails({ commit })
      await flushPromises()

      expect(commit).toHaveBeenCalledWith('SET_PREFERRED_LANGUAGE_TYPES', [])
    })

    it('maps preferredLanguageTypes from objects with value', async () => {
      const languageOptions = [
        { resourceId: 'r1', isoFriendlyName: 'English' },
        { resourceId: 'r2', isoFriendlyName: 'Turkish' }
      ]
      LookupLocalStorage.getSingle.mockResolvedValue(languageOptions)
      getScenarioDataDetails.mockResolvedValue({
        data: { data: { preferredLanguageTypes: [{ value: 'r1' }, { value: 'r2' }] } }
      })

      trainingLibraryHelpers.actions.callForScenarioFormDetails({ commit })
      await flushPromises()

      expect(commit).toHaveBeenCalledWith('SET_PREFERRED_LANGUAGE_TYPES', [
        { text: 'English', value: 'r1' },
        { text: 'Turkish', value: 'r2' }
      ])
    })

    it('filters out unmatched preferred language values', async () => {
      LookupLocalStorage.getSingle.mockResolvedValue([
        { resourceId: 'r1', isoFriendlyName: 'English' }
      ])
      getScenarioDataDetails.mockResolvedValue({
        data: { data: { preferredLanguageTypes: [{ value: 'r1' }, { value: 'missing' }] } }
      })

      trainingLibraryHelpers.actions.callForScenarioFormDetails({ commit })
      await flushPromises()

      expect(commit).toHaveBeenCalledWith('SET_PREFERRED_LANGUAGE_TYPES', [
        { text: 'English', value: 'r1' }
      ])
    })
  })

  describe('callForFormDetails', () => {
    it('commits all form details from enrollment form', async () => {
      AwarenessEducatorService.getEnrollmentFormDetails.mockResolvedValue({
        data: {
          data: {
            certificateEmailNotificationTemplateTypeResourceId: ['c1'],
            reminderEmailNotificationTemplateTypeResourceId: ['r1'],
            trainingEmailNotificationTemplateTypeResourceId: ['t1'],
            surveyEmailNotificationTemplateTypeResourceId: ['s1'],
            surveyReminderEmailNotificationTemplateTypeResourceId: ['sr1'],
            infographicEmailNotificationTemplateTypeResourceId: 'i1',
            learningPathEmailNotificationTemplateTypeResourceId: 'lp1',
            posterEmailNotificationTemplateTypeResourceId: 'p1',
            learningPathReminderEmailNotificationTemplateTypeResourceId: 'lpr1',
            enumNameValuePairs: { status: 'active' },
            canSaveVendor: true
          }
        }
      })

      await trainingLibraryHelpers.actions.callForFormDetails({ commit })

      expect(commit).toHaveBeenCalledWith(
        'SET_CERTIFICATE_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID',
        ['c1']
      )
      expect(commit).toHaveBeenCalledWith(
        'SET_REMINDER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID',
        ['r1']
      )
      expect(commit).toHaveBeenCalledWith(
        'SET_TRAINING_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID',
        ['t1']
      )
      expect(commit).toHaveBeenCalledWith(
        'SET_SURVEY_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID',
        ['s1']
      )
      expect(commit).toHaveBeenCalledWith(
        'SET_SURVEY_REMINDER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID',
        ['sr1']
      )
      expect(commit).toHaveBeenCalledWith(
        'SET_INFOGRAPHIC_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID',
        'i1'
      )
      expect(commit).toHaveBeenCalledWith(
        'SET_LEARNING_PATH_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID',
        'lp1'
      )
      expect(commit).toHaveBeenCalledWith(
        'SET_POSTER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID',
        'p1'
      )
      expect(commit).toHaveBeenCalledWith(
        'SET_LEARNING_PATH_REMINDER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID',
        'lpr1'
      )
      expect(commit).toHaveBeenCalledWith('SET_ENUM_TYPES', { status: 'active' })
      expect(commit).toHaveBeenCalledWith('SET_CAN_SAVE_VENDOR', true)
    })

    it('uses defaults when data is empty', async () => {
      AwarenessEducatorService.getEnrollmentFormDetails.mockResolvedValue({
        data: { data: {} }
      })

      await trainingLibraryHelpers.actions.callForFormDetails({ commit })

      expect(commit).toHaveBeenCalledWith(
        'SET_CERTIFICATE_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID',
        ''
      )
      expect(commit).toHaveBeenCalledWith(
        'SET_REMINDER_EMAIL_NOTIFICATION_TEMPLATE_TYPE_RESOURCE_ID',
        ''
      )
      expect(commit).toHaveBeenCalledWith('SET_CAN_SAVE_VENDOR', false)
    })
  })

  describe('getters', () => {
    it('getPreferredLanguageTypes returns state', () => {
      const state = { preferredLanguageTypes: [{ text: 'English', value: 'en' }] }
      expect(trainingLibraryHelpers.getters.getPreferredLanguageTypes(state)).toEqual([
        { text: 'English', value: 'en' }
      ])
    })

    it('getCanSaveVendor and getEnumTypes return state values', () => {
      const state = { canSaveVendor: true, enumTypes: { status: 'active' } }
      expect(trainingLibraryHelpers.getters.getCanSaveVendor(state)).toBe(true)
      expect(trainingLibraryHelpers.getters.getEnumTypes(state)).toEqual({ status: 'active' })
    })
  })

  describe('mutations', () => {
    it('SET_PREFERRED_LANGUAGE_TYPES', () => {
      const state = { preferredLanguageTypes: [] }
      trainingLibraryHelpers.mutations.SET_PREFERRED_LANGUAGE_TYPES(state, [{ text: 'EN', value: 'en' }])
      expect(state.preferredLanguageTypes).toEqual([{ text: 'EN', value: 'en' }])
    })

    it('SET_SCORM_TYPES', () => {
      const state = { scormTypes: [] }
      trainingLibraryHelpers.mutations.SET_SCORM_TYPES(state, [{ text: 'SCORM', value: '1' }])
      expect(state.scormTypes).toEqual([{ text: 'SCORM', value: '1' }])
    })

    it('SET_ENUM_TYPES and SET_CAN_SAVE_VENDOR update state', () => {
      const state = { enumTypes: {}, canSaveVendor: false }
      trainingLibraryHelpers.mutations.SET_ENUM_TYPES(state, { a: 1 })
      trainingLibraryHelpers.mutations.SET_CAN_SAVE_VENDOR(state, true)
      expect(state.enumTypes).toEqual({ a: 1 })
      expect(state.canSaveVendor).toBe(true)
    })
  })
})
