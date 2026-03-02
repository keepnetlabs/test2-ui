import { shallowMount } from '@vue/test-utils'
import AddinSettings from '@/components/PhishingReporter/Settings/AddinSettings.vue'

jest.mock('@/utils/functions', () => ({
  ...jest.requireActual('@/utils/functions'),
  scrollToComponent: jest.fn()
}))

jest.mock('@/api/phishingReporter', () => ({
  getPhishingReporterImg: jest.fn().mockResolvedValue({ data: '' }),
  getDefaultSettingsForLanguage: jest.fn().mockResolvedValue({ data: { data: '{}' } })
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  getSingle: jest.fn().mockResolvedValue([
    { isoFriendlyName: 'English (United Kingdom)', name: 'en-GB', resourceId: 1 },
    { isoFriendlyName: 'French', name: 'fr-FR', resourceId: 2 }
  ])
}))

describe('AddinSettings.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(AddinSettings, {
      propsData: {
        showHeader: true,
        showFooter: true,
        showForm: true,
        formData: null,
        ...propsData
      },
      mocks: {
        $store: {
          getters: { 'whitelabel/getBrandName': '' },
          dispatch: jest.fn()
        }
      },
      stubs: {
        LanguageDeletionDialog: true,
        VersionHistoryModal: true,
        ReporterVersionModal: true,
        PhishingSettingsFooter: true,
        KFileUpload: true,
        InputEntityName: true,
        InputDescription: true,
        KSelect: true,
        AlertBox: true,
        ElTabs: true,
        ElTabPane: true,
        VSkeletonLoader: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('submit', () => {
    it('emits updateForm when validation passes', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      wrapper.vm.$refs = { refForm: { validate: () => true } }
      const result = wrapper.vm.submit({}, false)
      expect(wrapper.emitted('updateForm')).toBeTruthy()
      expect(wrapper.emitted('updateForm')[0][0]).toMatchObject({ isAddIn: false })
      expect(result).toBeDefined()
    })

    it('emits updateForm with isAddIn true', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      wrapper.vm.$refs = { refForm: { validate: () => true } }
      wrapper.vm.submit({}, true)
      expect(wrapper.emitted('updateForm')[0][0]).toMatchObject({ isAddIn: true })
    })

    it('returns false and does not emit when validation fails', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      wrapper.vm.$refs = {
        refForm: {
          validate: () => false,
          $el: { querySelector: () => document.createElement('div') }
        }
      }
      const result = wrapper.vm.submit({})
      expect(result).toBe(false)
      expect(wrapper.emitted('updateForm')).toBeFalsy()
    })

    it('dispatches snackbar and returns early when invalid languages exist', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          dialogBoxSettings: [
            {
              languageName: 'English (United Kingdom)',
              msgBoxTitle: '',
              analysisThankYouMessage: ''
            }
          ]
        }
      })
      wrapper.vm.submit({})
      expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
        'common/createSnackBar',
        expect.objectContaining({ icon: 'mdi-alert' })
      )
      expect(wrapper.emitted('updateForm')).toBeFalsy()
    })
  })

  describe('getCurrentValues', () => {
    it('returns formValues', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      const result = wrapper.vm.getCurrentValues()
      expect(result).toHaveProperty('addInName')
      expect(result).toHaveProperty('dialogBoxSettings')
    })
  })

  describe('getFormValues', () => {
    it('returns formValues when validation passes', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      wrapper.vm.$refs = { refForm: { validate: () => true } }
      const result = wrapper.vm.getFormValues()
      expect(result).toBeDefined()
      expect(result).toHaveProperty('addInName')
    })

    it('returns false when validation fails', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      wrapper.vm.$refs = { refForm: { validate: () => false } }
      const result = wrapper.vm.getFormValues()
      expect(result).toBe(false)
    })
  })

  describe('formValues watcher', () => {
    it('emits formValuesChanged when formValues differ from initial', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          addInName: 'Changed Name'
        }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('formValuesChanged')).toBeTruthy()
    })
  })

  describe('defaultLanguage watcher', () => {
    it('returns early when val is null', () => {
      const ctx = {
        formValues: {
          dialogBoxSettings: [
            { languageName: 'English (United Kingdom)', isDefault: false },
            { languageName: 'French', isDefault: true }
          ]
        }
      }
      expect(() => {
        AddinSettings.watch.defaultLanguage.call(ctx, null)
      }).not.toThrow()
    })

    it('returns early when val is empty string', () => {
      const ctx = {
        formValues: {
          dialogBoxSettings: [
            { languageName: 'English (United Kingdom)', isDefault: false }
          ]
        }
      }
      AddinSettings.watch.defaultLanguage.call(ctx, '')
      expect(ctx.formValues.dialogBoxSettings[0].isDefault).toBe(false)
    })
  })

  describe('handleDeleteSelectedLanguageConfirm', () => {
    it('returns early when languageItemIndex is -1', () => {
      const ctx = {
        selectedLanguageToDelete: 'NonExistent',
        formValues: {
          dialogBoxSettings: [{ languageName: 'English (United Kingdom)' }]
        }
      }
      AddinSettings.methods.handleDeleteSelectedLanguageConfirm.call(ctx)
      expect(ctx.formValues.dialogBoxSettings).toHaveLength(1)
    })
  })

  describe('getDefaultLanguageOptions', () => {
    it('returns empty array when dialogBoxSettings is empty', () => {
      const wrapper = createWrapper()
      wrapper.setData({
        formValues: { dialogBoxSettings: [] }
      })
      expect(wrapper.vm.getDefaultLanguageOptions).toEqual([])
    })
  })

  describe('getLabelWidth', () => {
    it('returns width based on language length', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getLabelWidth('French')).toBe('48px')
      expect(wrapper.vm.getLabelWidth('English (United Kingdom)')).toBe('192px')
    })
  })

  describe('checkDialogBoxSettings', () => {
    it('returns invalid languages when validation fails', () => {
      const wrapper = createWrapper()
      wrapper.setData({
        formValues: {
          dialogBoxSettings: [
            {
              languageName: 'English (United Kingdom)',
              msgBoxTitle: '',
              analysisThankYouMessage: ''
            }
          ]
        }
      })
      const invalid = wrapper.vm.checkDialogBoxSettings()
      expect(invalid.length).toBeGreaterThan(0)
    })

    it('returns empty array when all valid', () => {
      const wrapper = createWrapper()
      wrapper.setData({
        formValues: {
          dialogBoxSettings: [
            {
              languageName: 'English (United Kingdom)',
              msgBoxTitle: 'Title',
              msgBoxBtnYesText: 'Yes',
              msgBoxBtnNoText: 'No',
              msgBoxBtnCancelText: 'Cancel',
              msgBoxBtnOkText: 'Okay',
              analysisThankYouMessage: 'Thank you',
              noInternetConnectionMessage: 'No internet',
              emailSendingErrorMessage: 'Error',
              emailSelectionErrorMessage: 'Select',
              badFormatEmailMessage: 'Bad format',
              isConfirmationBeforeAnalysis: false,
              isDeleteEmailBeforeAnalysis: false,
              isSendSimulationMails: false
            }
          ]
        }
      })
      const invalid = wrapper.vm.checkDialogBoxSettings()
      expect(invalid).toEqual([])
    })
  })
})
