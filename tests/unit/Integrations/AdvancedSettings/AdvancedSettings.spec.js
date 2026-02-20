import AdvancedSettings from '@/components/Integrations/AdvancedSettings/AdvancedSettings.vue'
import { getAnalysisExclusions, updateAnalysisExclusions } from '@/api/integrations'

jest.mock('@/api/integrations', () => ({
  getAnalysisExclusions: jest.fn(),
  updateAnalysisExclusions: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('AdvancedSettings.vue methods', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed isActionButtonDisabled follows UPDATE permission', () => {
    expect(
      AdvancedSettings.computed.isActionButtonDisabled.call({
        permissions: { UPDATE: { hasPermission: true } }
      })
    ).toBe(false)
    expect(
      AdvancedSettings.computed.isActionButtonDisabled.call({
        permissions: { UPDATE: { hasPermission: false } }
      })
    ).toBe(true)
    expect(AdvancedSettings.computed.isActionButtonDisabled.call({ permissions: {} })).toBe(true)
  })

  it('setLoading updates isLoading state', () => {
    const ctx = { isLoading: false }
    AdvancedSettings.methods.setLoading.call(ctx, true)
    expect(ctx.isLoading).toBe(true)
    AdvancedSettings.methods.setLoading.call(ctx)
    expect(ctx.isLoading).toBe(false)
  })

  it('removeKeysFromData keeps only editable records with different key', () => {
    const ctx = {
      formData: [
        { exclusionType: 'URL', isEditable: true, value: 'a' },
        { exclusionType: 'URL', isEditable: false, value: 'b' },
        { exclusionType: 'IP', isEditable: true, value: '1.1.1.1' }
      ]
    }

    const result = AdvancedSettings.methods.removeKeysFromData.call(ctx, 'URL')
    expect(result).toEqual([{ exclusionType: 'IP', isEditable: true, value: '1.1.1.1' }])
  })

  it('getAnalysisExclusions fetches items and sets formData', async () => {
    getAnalysisExclusions.mockResolvedValueOnce({
      data: { data: { exclusionItems: [{ exclusionType: 'URL', value: 'x' }] } }
    })
    const ctx = {
      formData: [],
      setLoading: jest.fn()
    }

    AdvancedSettings.methods.getAnalysisExclusions.call(ctx)
    await flushPromises()

    expect(getAnalysisExclusions).toHaveBeenCalled()
    expect(ctx.formData).toEqual([{ exclusionType: 'URL', value: 'x' }])
    expect(ctx.setLoading).toHaveBeenCalledWith(true)
  })

  it('handleSubmit merges payload with filtered existing data then refreshes', async () => {
    updateAnalysisExclusions.mockResolvedValueOnce({})
    const getAnalysisExclusionsSpy = jest.fn()
    const ctx = {
      setLoading: jest.fn(),
      getAnalysisExclusions: getAnalysisExclusionsSpy,
      removeKeysFromData: jest.fn(() => [{ exclusionType: 'IP', value: '2.2.2.2' }])
    }
    const payload = [{ exclusionType: 'URL', value: 'https://x.test' }]

    AdvancedSettings.methods.handleSubmit.call(ctx, payload, 'URL')
    await flushPromises()

    expect(updateAnalysisExclusions).toHaveBeenCalledWith({
      exclusionItems: [
        { exclusionType: 'IP', value: '2.2.2.2' },
        { exclusionType: 'URL', value: 'https://x.test' }
      ]
    })
    expect(getAnalysisExclusionsSpy).toHaveBeenCalled()
    expect(ctx.setLoading).toHaveBeenCalledWith(true)
  })
})
