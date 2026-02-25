import FirstTime from '@/components/PhishingReporter/Settings/FirstTime.vue'

describe('FirstTime.vue', () => {
  it('changeAddInConfigurationStatus sets showAddInConfiguration', () => {
    const ctx = { showAddInConfiguration: false }
    FirstTime.methods.changeAddInConfigurationStatus.call(ctx, true)
    expect(ctx.showAddInConfiguration).toBe(true)
  })

  it('getReport emits getPhishingReport', () => {
    const ctx = { $emit: jest.fn() }
    FirstTime.methods.getReport.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('getPhishingReport')
  })

  it('data returns showAddInConfiguration', () => {
    const data = FirstTime.data()
    expect(data.showAddInConfiguration).toBe(false)
  })
})
