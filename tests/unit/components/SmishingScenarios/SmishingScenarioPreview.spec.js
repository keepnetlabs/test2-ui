jest.mock('@/api/smishing', () => ({
  previewSmishingScenario: jest.fn(() => Promise.resolve({ data: { data: {} } }))
}))

import SmishingScenarioPreview from '@/components/SmishingScenarios/SmishingScenarioPreview.vue'

describe('SmishingScenarioPreview.vue', () => {
  it('getTitle returns preview title', () => {
    expect(SmishingScenarioPreview.computed.getTitle.call({})).toBe('Smishing Scenario Preview')
  })

  it('getSubtitle returns selectedRow name', () => {
    const ctx = { selectedRow: { name: 'Test Scenario' } }
    expect(SmishingScenarioPreview.computed.getSubtitle.call(ctx)).toBe('Test Scenario')
  })

  it('handleClose emits on-close', () => {
    const ctx = { $emit: jest.fn() }
    SmishingScenarioPreview.methods.handleClose.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-close')
  })

  it('handlePreviousTemplate decrements selectedLandingPageIndex', () => {
    const ctx = { selectedLandingPageIndex: 2 }
    SmishingScenarioPreview.methods.handlePreviousTemplate.call(ctx)
    expect(ctx.selectedLandingPageIndex).toBe(1)
  })

  it('handleNextTemplate increments selectedLandingPageIndex', () => {
    const ctx = { selectedLandingPageIndex: 1 }
    SmishingScenarioPreview.methods.handleNextTemplate.call(ctx)
    expect(ctx.selectedLandingPageIndex).toBe(2)
  })
})
