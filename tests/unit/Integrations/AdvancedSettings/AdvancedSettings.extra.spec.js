import AdvancedSettings from '@/components/Integrations/AdvancedSettings/AdvancedSettings.vue'
import { getAnalysisExclusions, updateAnalysisExclusions } from '@/api/integrations'

jest.mock('@/api/integrations', () => ({
  getAnalysisExclusions: jest.fn(),
  updateAnalysisExclusions: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('AdvancedSettings.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('removeKeysFromData returns only editable and key-mismatched items', () => {
    const ctx = {
      formData: [
        { exclusionType: 'URL', isEditable: true },
        { exclusionType: 'IP', isEditable: true },
        { exclusionType: 'IP', isEditable: false }
      ]
    }

    expect(AdvancedSettings.methods.removeKeysFromData.call(ctx, 'IP')).toEqual([
      { exclusionType: 'URL', isEditable: true }
    ])
  })

  it('isActionButtonDisabled follows UPDATE permission', () => {
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
    expect(
      AdvancedSettings.computed.isActionButtonDisabled.call({
        permissions: {}
      })
    ).toBe(true)
  })

  it('setLoading uses explicit value and defaults to false', () => {
    const ctx = { isLoading: false }
    AdvancedSettings.methods.setLoading.call(ctx, true)
    expect(ctx.isLoading).toBe(true)

    AdvancedSettings.methods.setLoading.call(ctx)
    expect(ctx.isLoading).toBe(false)
  })

  it('getAnalysisExclusions maps exclusion items on success', async () => {
    getAnalysisExclusions.mockResolvedValueOnce({
      data: { data: { exclusionItems: [{ exclusionType: 'URL', isEditable: true }] } }
    })
    const ctx = {
      formData: [],
      setLoading: jest.fn()
    }

    AdvancedSettings.methods.getAnalysisExclusions.call(ctx)
    await flushPromises()

    expect(ctx.formData).toEqual([{ exclusionType: 'URL', isEditable: true }])
    expect(ctx.setLoading).toHaveBeenCalledWith(true)
  })

  it('getAnalysisExclusions keeps old formData when api rejects', async () => {
    getAnalysisExclusions.mockRejectedValueOnce(new Error('fail'))
    const ctx = {
      formData: [{ exclusionType: 'URL' }],
      setLoading: jest.fn()
    }

    AdvancedSettings.methods.getAnalysisExclusions.call(ctx)
    await flushPromises()

    expect(ctx.formData).toEqual([{ exclusionType: 'URL' }])
    expect(ctx.setLoading).toHaveBeenCalledWith(true)
  })

  it('handleSubmit still resets loading when update api rejects', async () => {
    updateAnalysisExclusions.mockRejectedValueOnce(new Error('fail'))
    const ctx = {
      setLoading: jest.fn(),
      getAnalysisExclusions: jest.fn(),
      removeKeysFromData: jest.fn(() => [{ exclusionType: 'IP', isEditable: true }])
    }

    AdvancedSettings.methods.handleSubmit.call(ctx, [{ exclusionType: 'URL' }], 'URL')
    await flushPromises()

    expect(updateAnalysisExclusions).toHaveBeenCalledWith({
      exclusionItems: [{ exclusionType: 'IP', isEditable: true }, { exclusionType: 'URL' }]
    })
    expect(ctx.getAnalysisExclusions).not.toHaveBeenCalled()
  })

  it('handleSubmit refreshes exclusions on success', async () => {
    updateAnalysisExclusions.mockResolvedValueOnce({})
    const ctx = {
      setLoading: jest.fn(),
      getAnalysisExclusions: jest.fn(),
      removeKeysFromData: jest.fn(() => [{ exclusionType: 'IP', isEditable: true }])
    }

    AdvancedSettings.methods.handleSubmit.call(ctx, [{ exclusionType: 'URL' }], 'URL')
    await flushPromises()

    expect(ctx.getAnalysisExclusions).toHaveBeenCalledTimes(1)
  })
})
