import Settings from '@/components/PhishingReporter/Settings/Settings.vue'
import { createPhishingReporter } from '@/api/phishingReporter'

jest.mock('@/api/phishingReporter', () => ({
  __esModule: true,
  createGraphAccount: jest.fn(),
  createPhishingReporter: jest.fn(),
  updateApplicationLevelAccount: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Settings.vue (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.APP_CONFIG = {}
  })

  describe('callForCreatePhishingReporter', () => {
    it('handles createPhishingReporter rejection in catch', async () => {
      createPhishingReporter.mockRejectedValue(new Error('API Error'))
      const emit = jest.fn()
      const ctx = {
        saveDisable: true,
        saveButtonDisabled: true,
        formData: { dialogBoxSettings: [], file: { name: 'logo.png' } },
        $emit: emit,
        $refs: {
          refAddinSettings: { getFormValues: () => ({ addInName: 'Reporter', dialogBoxSettings: [] }) },
          refEmailSettings: { getFormValues: () => ({}) },
          refOtherSettings: { getFormValues: () => ({}) },
          refDiagnosticTool: { getFormValues: () => ({}) }
        },
        activateLoader: jest.fn(),
        getFormDataValue: Settings.methods.getFormDataValue
      }

      Settings.methods.callForCreatePhishingReporter.call(ctx, { isAddIn: true })
      await flushPromises()

      expect(ctx.saveDisable).toBe(false)
      expect(emit).toHaveBeenCalledWith('getPhishingReport')
      expect(ctx.activateLoader).toHaveBeenCalledWith(-1)
    })

    it('handles refs returning undefined with fallback to empty object', async () => {
      createPhishingReporter.mockResolvedValue({})
      const ctx = {
        saveDisable: true,
        saveButtonDisabled: true,
        formData: { dialogBoxSettings: [], file: { name: 'logo.png' } },
        $emit: jest.fn(),
        $refs: {},
        activateLoader: jest.fn(),
        getFormDataValue: Settings.methods.getFormDataValue
      }

      Settings.methods.callForCreatePhishingReporter.call(ctx, { isAddIn: false })
      await flushPromises()

      expect(createPhishingReporter).toHaveBeenCalled()
    })
  })

  describe('getFormDataValue', () => {
    it('returns empty string for null', () => {
      expect(Settings.methods.getFormDataValue.call({}, null)).toBe('')
    })

    it('returns empty string for undefined', () => {
      expect(Settings.methods.getFormDataValue.call({}, undefined)).toBe('')
    })

    it('returns value for truthy values', () => {
      expect(Settings.methods.getFormDataValue.call({}, 'test')).toBe('test')
      expect(Settings.methods.getFormDataValue.call({}, 0)).toBe(0)
      expect(Settings.methods.getFormDataValue.call({}, false)).toBe(false)
    })
  })
})
