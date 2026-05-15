jest.mock('@/api/companyIpRestrictions', () => ({
  createCompanyIpRestrictions: jest.fn(() => Promise.resolve({})),
  deleteCompanyIpRestriction: jest.fn(() => Promise.resolve({})),
  getCompanyIpRestrictions: jest.fn(() => Promise.resolve({ data: { data: [] } }))
}))

import IpRestrictions from '@/components/Company Settings/IpRestrictions/IpRestrictions.vue'
import {
  createCompanyIpRestrictions,
  deleteCompanyIpRestriction,
  getCompanyIpRestrictions
} from '@/api/companyIpRestrictions'

describe('IpRestrictions.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('normalizes array and object response shapes', () => {
    const normalize = IpRestrictions.methods.normalizeIpRestrictions

    expect(
      normalize([
        { resourceId: 'abc', ipRange: '192.168.1.0/24' },
        { id: 'def', ipAddress: '10.0.0.1' }
      ])
    ).toEqual([
      { key: 'abc', ipRange: '192.168.1.0/24', resourceId: 'abc' },
      { key: 'def', ipRange: '10.0.0.1', resourceId: 'def' }
    ])

    expect(normalize({ ipRanges: ['172.16.0.0/16'] })).toEqual([
      { key: '172.16.0.0/16-0', ipRange: '172.16.0.0/16', resourceId: '' }
    ])
  })

  it('derives added and deleted IP ranges for staged save', () => {
    const ctx = {
      initialData: ['192.168.1.0/24', '10.0.0.1'],
      dataContainerWithSearchItems: ['10.0.0.1', '172.16.0.0/16'],
      initialIpRestrictionItems: [
        { resourceId: 'abc', ipRange: '192.168.1.0/24' },
        { resourceId: 'def', ipRange: '10.0.0.1' }
      ]
    }

    expect(IpRestrictions.computed.addedIpRanges.call(ctx)).toEqual(['172.16.0.0/16'])
    expect(
      IpRestrictions.computed.deletedIpRestrictionItems.call(ctx)
    ).toEqual([{ resourceId: 'abc', ipRange: '192.168.1.0/24' }])
  })

  it('keeps save enabled when draft has changes', () => {
    expect(
      IpRestrictions.computed.getIsActionButtonDisabled.call({
        isSaving: false,
        isInitialDataAndModelEqual: false,
      })
    ).toBe(false)
  })

  it('keeps save enabled when the last saved IP is staged for deletion', () => {
    expect(
      IpRestrictions.computed.getIsActionButtonDisabled.call({
        isSaving: false,
        isInitialDataAndModelEqual: false,
        hasRequiredPermissions: true
      })
    ).toBe(false)
  })

  it('shows default alert only when saved and draft state are both empty', () => {
    expect(
      IpRestrictions.computed.canRenderDefaultAlert.call({
        initialIpRestrictionItems: [],
        dataContainerWithSearchItems: []
      })
    ).toBe(true)

    expect(
      IpRestrictions.computed.canRenderDefaultAlert.call({
        initialIpRestrictionItems: [{ resourceId: 'abc', ipRange: '10.0.0.1' }],
        dataContainerWithSearchItems: []
      })
    ).toBe(false)
  })

  it('disables save while saving or when there are no changes', () => {
    expect(
      IpRestrictions.computed.getIsActionButtonDisabled.call({
        isSaving: true,
        isInitialDataAndModelEqual: false
      })
    ).toBe(true)

    expect(
      IpRestrictions.computed.getIsActionButtonDisabled.call({
        isSaving: false,
        isInitialDataAndModelEqual: true
      })
    ).toBe(true)
  })

  it('updates input rules only while the add input has a value', () => {
    const ctx = {
      inputRules: [],
      ipRangeRules: ['rule']
    }

    IpRestrictions.watch.ipAddressSearch.call(ctx, '10.0.0.1')
    expect(ctx.inputRules).toEqual(['rule'])

    IpRestrictions.watch.ipAddressSearch.call(ctx, '')
    expect(ctx.inputRules).toEqual([])
  })

  it('validates single IP and CIDR ranges without wildcard notation', () => {
    const validateIpRange = IpRestrictions.methods.validateIpRange

    expect(validateIpRange('10.0.0.1')).toBe(true)
    expect(validateIpRange('192.168.1.0/24')).toBe(true)
    expect(validateIpRange('192.168.*.1')).toBe('Invalid IP range')
  })

  it('batch import prepends unique values', () => {
    const ctx = {
      dataContainerWithSearchItems: ['10.0.0.1']
    }

    IpRestrictions.methods.handleBatchImport.call(ctx, ['10.0.0.1', '172.16.0.0/16'])

    expect(ctx.dataContainerWithSearchItems).toEqual(['10.0.0.1', '172.16.0.0/16'])
  })

  it('ignores empty batch import payloads', () => {
    const ctx = {
      dataContainerWithSearchItems: ['10.0.0.1']
    }

    IpRestrictions.methods.handleBatchImport.call(ctx, [])

    expect(ctx.dataContainerWithSearchItems).toEqual(['10.0.0.1'])
  })

  it('updates draft items from DataContainerWithSearch input event', () => {
    const ctx = {
      dataContainerWithSearchItems: []
    }

    IpRestrictions.methods.handleInput.call(ctx, ['10.0.0.1'])

    expect(ctx.dataContainerWithSearchItems).toEqual(['10.0.0.1'])
  })

  it('adds a searched IP once and resets the input', () => {
    const resetIpAddresses = jest.fn(function () {
      this.ipAddressSearch = ''
    })
    const ctx = {
      dataContainerWithSearchItems: ['10.0.0.1'],
      ipAddressSearch: '10.0.0.1',
      resetIpAddresses
    }

    IpRestrictions.methods.handleIpAddressesAdd.call(ctx)

    expect(ctx.dataContainerWithSearchItems).toEqual(['10.0.0.1'])
    expect(resetIpAddresses).toHaveBeenCalled()
    expect(ctx.ipAddressSearch).toBe('')
  })

  it('does not add an empty searched IP', () => {
    const resetIpAddresses = jest.fn()
    const ctx = {
      dataContainerWithSearchItems: ['10.0.0.1'],
      ipAddressSearch: '',
      resetIpAddresses
    }

    IpRestrictions.methods.handleIpAddressesAdd.call(ctx)

    expect(ctx.dataContainerWithSearchItems).toEqual(['10.0.0.1'])
    expect(resetIpAddresses).not.toHaveBeenCalled()
  })

  it('resets searched IP input', () => {
    const ctx = {
      ipAddressSearch: '10.0.0.1'
    }

    IpRestrictions.methods.resetIpAddresses.call(ctx)

    expect(ctx.ipAddressSearch).toBe('')
  })

  it('keeps initial data unchanged when draft array is mutated', () => {
    const ctx = {
      initialData: ['10.0.0.1'],
      dataContainerWithSearchItems: ['10.0.0.1']
    }

    ctx.dataContainerWithSearchItems.splice(0, 1)

    expect(ctx.initialData).toEqual(['10.0.0.1'])
    expect(IpRestrictions.computed.isInitialDataAndModelEqual.call(ctx)).toBe(false)
  })

  it('shows a success snackbar with fallback message', () => {
    const dispatch = jest.fn()

    IpRestrictions.methods.showSuccessSnackbar.call({
      $store: { dispatch }
    })

    expect(dispatch).toHaveBeenCalledWith('common/createSnackBar', {
      color: '#43a047',
      icon: 'mdi-check-circle',
      message: 'IP restrictions updated successfully.'
    })
  })

  it('loads restrictions and clones initial data for draft edits', async () => {
    getCompanyIpRestrictions.mockResolvedValueOnce({
      data: {
        data: [{ resourceId: 'abc', ipRange: '10.0.0.1' }]
      }
    })
    const ctx = {
      isLoading: false,
      initialIpRestrictionItems: [],
      initialData: [],
      dataContainerWithSearchItems: [],
      normalizeIpRestrictions: IpRestrictions.methods.normalizeIpRestrictions
    }

    await IpRestrictions.methods.callForIpRestrictions.call(ctx)

    expect(ctx.isLoading).toBe(false)
    expect(ctx.initialData).toEqual(['10.0.0.1'])
    expect(ctx.dataContainerWithSearchItems).toEqual(['10.0.0.1'])
    expect(ctx.dataContainerWithSearchItems).not.toBe(ctx.initialData)
  })

  it('clears loading when loading restrictions fails', async () => {
    getCompanyIpRestrictions.mockRejectedValueOnce(new Error('failed'))
    const ctx = {
      isLoading: false,
      normalizeIpRestrictions: jest.fn()
    }

    await expect(IpRestrictions.methods.callForIpRestrictions.call(ctx)).rejects.toThrow('failed')

    expect(ctx.isLoading).toBe(false)
  })

  it('does not save without a DataContainerWithSearch ref', () => {
    const result = IpRestrictions.methods.handleSaveChanges.call({
      $refs: {}
    })

    expect(result).toBe(false)
    expect(createCompanyIpRestrictions).not.toHaveBeenCalled()
    expect(deleteCompanyIpRestriction).not.toHaveBeenCalled()
  })

  it('does not save invalid draft entries', () => {
    const checkAllValid = jest.fn()
    const result = IpRestrictions.methods.handleSaveChanges.call({
      $refs: {
        dataContainerWithSearch: {
          checkAllValid,
          isAllValid: false
        }
      }
    })

    expect(result).toBe(false)
    expect(checkAllValid).toHaveBeenCalled()
    expect(createCompanyIpRestrictions).not.toHaveBeenCalled()
    expect(deleteCompanyIpRestriction).not.toHaveBeenCalled()
  })

  it('refreshes without snackbar when there are no API requests to make', async () => {
    const callForIpRestrictions = jest.fn(() => Promise.resolve())
    const showSuccessSnackbar = jest.fn()

    await IpRestrictions.methods.handleSaveChanges.call({
      $refs: {
        dataContainerWithSearch: {
          checkAllValid: jest.fn(),
          isAllValid: true
        }
      },
      addedIpRanges: [],
      deletedIpRestrictionItems: [{ ipRange: '10.0.0.1', resourceId: '' }],
      callForIpRestrictions,
      showSuccessSnackbar
    })

    expect(callForIpRestrictions).toHaveBeenCalled()
    expect(showSuccessSnackbar).not.toHaveBeenCalled()
  })

  it('creates added IP ranges on save', async () => {
    const callForIpRestrictions = jest.fn(() => Promise.resolve())
    const showSuccessSnackbar = jest.fn()
    const ctx = {
      $refs: {
        dataContainerWithSearch: {
          checkAllValid: jest.fn(),
          isAllValid: true
        }
      },
      addedIpRanges: ['172.16.0.0/16'],
      deletedIpRestrictionItems: [],
      isSaving: false,
      callForIpRestrictions,
      showSuccessSnackbar
    }

    await IpRestrictions.methods.handleSaveChanges.call(ctx)

    expect(createCompanyIpRestrictions).toHaveBeenCalledWith({
      ipRanges: ['172.16.0.0/16']
    })
    expect(deleteCompanyIpRestriction).not.toHaveBeenCalled()
    expect(showSuccessSnackbar).toHaveBeenCalled()
    expect(callForIpRestrictions).toHaveBeenCalled()
    expect(ctx.isSaving).toBe(false)
  })

  it('deletes removed IP ranges with resource ids on save', async () => {
    const callForIpRestrictions = jest.fn(() => Promise.resolve())
    const showSuccessSnackbar = jest.fn()

    await IpRestrictions.methods.handleSaveChanges.call({
      $refs: {
        dataContainerWithSearch: {
          checkAllValid: jest.fn(),
          isAllValid: true
        }
      },
      addedIpRanges: [],
      deletedIpRestrictionItems: [
        { ipRange: '10.0.0.1', resourceId: 'abc' },
        { ipRange: '192.168.1.0/24', resourceId: '' }
      ],
      isSaving: false,
      callForIpRestrictions,
      showSuccessSnackbar
    })

    expect(deleteCompanyIpRestriction).toHaveBeenCalledTimes(1)
    expect(deleteCompanyIpRestriction).toHaveBeenCalledWith('abc')
    expect(createCompanyIpRestrictions).not.toHaveBeenCalled()
    expect(showSuccessSnackbar).toHaveBeenCalled()
  })

  it('creates and deletes in one save workflow', async () => {
    const callForIpRestrictions = jest.fn(() => Promise.resolve())
    const showSuccessSnackbar = jest.fn()

    await IpRestrictions.methods.handleSaveChanges.call({
      $refs: {
        dataContainerWithSearch: {
          checkAllValid: jest.fn(),
          isAllValid: true
        }
      },
      addedIpRanges: ['172.16.0.0/16'],
      deletedIpRestrictionItems: [{ ipRange: '10.0.0.1', resourceId: 'abc' }],
      isSaving: false,
      callForIpRestrictions,
      showSuccessSnackbar
    })

    expect(createCompanyIpRestrictions).toHaveBeenCalledWith({
      ipRanges: ['172.16.0.0/16']
    })
    expect(deleteCompanyIpRestriction).toHaveBeenCalledWith('abc')
    expect(showSuccessSnackbar).toHaveBeenCalled()
  })

  it('resets saving state when save request fails', async () => {
    createCompanyIpRestrictions.mockRejectedValueOnce(new Error('failed'))
    const ctx = {
      $refs: {
        dataContainerWithSearch: {
          checkAllValid: jest.fn(),
          isAllValid: true
        }
      },
      addedIpRanges: ['172.16.0.0/16'],
      deletedIpRestrictionItems: [],
      isSaving: false,
      callForIpRestrictions: jest.fn(),
      showSuccessSnackbar: jest.fn()
    }

    await expect(IpRestrictions.methods.handleSaveChanges.call(ctx)).rejects.toThrow('failed')

    expect(ctx.isSaving).toBe(false)
    expect(ctx.showSuccessSnackbar).not.toHaveBeenCalled()
  })

  it('toggles batch import popup status', () => {
    const ctx = {
      isBatchImportPopupOpen: false
    }

    IpRestrictions.methods.toggleBatchImportPopup.call(ctx)
    expect(ctx.isBatchImportPopupOpen).toBe(true)

    IpRestrictions.methods.toggleBatchImportPopup.call(ctx)
    expect(ctx.isBatchImportPopupOpen).toBe(false)
  })
})
