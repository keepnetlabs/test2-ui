import Investigations from '@/views/Investigations.vue'

describe('Investigations.vue', () => {
  it('has correct component name', () => {
    expect(Investigations.name).toBe('Investigations')
  })

  it('computed title/icon change by selectedPlaybookId', () => {
    expect(Investigations.computed.getTitle.call({ selectedPlaybookId: null })).toBe('Create New Rule')
    expect(Investigations.computed.getIconName.call({ selectedPlaybookId: null })).toBe('mdi-plus')
    expect(Investigations.computed.getTitle.call({ selectedPlaybookId: 'p1' })).toBe('Edit Rule')
    expect(Investigations.computed.getIconName.call({ selectedPlaybookId: 'p1' })).toBe('mdi-pencil')
  })

  it('getDynamicScanStatusWidth handles invalid and valid values', () => {
    expect(Investigations.methods.getDynamicScanStatusWidth.call({}, null)).toBe(250)
    expect(Investigations.methods.getDynamicScanStatusWidth.call({}, [['OK', 2]])).toBeGreaterThan(175)
  })

  it('beforeRouteLeave blocks when modal open, otherwise continues', () => {
    const next = jest.fn()
    const ctx = {
      $refs: {
        refNewInvestigation: {
          status: true,
          handleClose: jest.fn()
        }
      }
    }
    Investigations.beforeRouteLeave.call(ctx, { name: 'Other' }, {}, next)
    expect(ctx.$refs.refNewInvestigation.handleClose).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)

    const next2 = jest.fn()
    Investigations.beforeRouteLeave.call({ $refs: {} }, { name: 'Any' }, {}, next2)
    expect(next2).toHaveBeenCalledWith()
  })
})
