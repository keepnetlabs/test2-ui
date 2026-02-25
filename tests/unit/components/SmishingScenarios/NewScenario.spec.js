import NewScenario from '@/components/SmishingScenarios/NewScenario.vue'

describe('SmishingScenarios NewScenario.vue', () => {
  it('getModalTitle returns New Smishing Scenario when not edit', () => {
    const ctx = { isEdit: false, isDuplicate: false }
    expect(NewScenario.computed.getModalTitle.call(ctx)).toBe('New Smishing Scenario')
  })

  it('getModalTitle returns Edit Smishing Scenario when edit', () => {
    const ctx = { isEdit: true, isDuplicate: false }
    expect(NewScenario.computed.getModalTitle.call(ctx)).toBe('Edit Smishing Scenario')
  })

  it('getModalTitle returns Duplicate Smishing Scenario when duplicate', () => {
    const ctx = { isEdit: true, isDuplicate: true }
    expect(NewScenario.computed.getModalTitle.call(ctx)).toBe('Duplicate Smishing Scenario')
  })
})
