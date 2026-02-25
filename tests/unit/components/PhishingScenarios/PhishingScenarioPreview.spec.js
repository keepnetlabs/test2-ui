jest.mock('@/api/phishingsimulator', () => ({
  getPhishingScenarioLandingPageAndEmailTemplate: jest.fn(() =>
    Promise.resolve({ data: { data: {} } })
  )
}))

import PhishingScenarioPreview from '@/components/PhishingScenarios/PhishingScenarioPreview.vue'

describe('PhishingScenarioPreview.vue', () => {
  it('getTitle returns Scenario Preview', () => {
    expect(PhishingScenarioPreview.computed.getTitle.call({})).toBe('Scenario Preview')
  })

  it('getSubtitle returns selectedRow name', () => {
    const ctx = { selectedRow: { name: 'Test Scenario' } }
    expect(PhishingScenarioPreview.computed.getSubtitle.call(ctx)).toBe('Test Scenario')
  })

  it('isAttachmentBasedScenario returns true when method is Attachment', () => {
    const ctx = { selectedRow: { method: 'Attachment' } }
    expect(PhishingScenarioPreview.computed.isAttachmentBasedScenario.call(ctx)).toBe(true)
  })

  it('handleClose emits on-close', () => {
    const ctx = { $emit: jest.fn() }
    PhishingScenarioPreview.methods.handleClose.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-close')
  })

  it('handlePreviousTemplate decrements selectedLandingPageIndex', () => {
    const ctx = { selectedLandingPageIndex: 2 }
    PhishingScenarioPreview.methods.handlePreviousTemplate.call(ctx)
    expect(ctx.selectedLandingPageIndex).toBe(1)
  })

  it('handleNextTemplate increments selectedLandingPageIndex', () => {
    const ctx = { selectedLandingPageIndex: 1 }
    PhishingScenarioPreview.methods.handleNextTemplate.call(ctx)
    expect(ctx.selectedLandingPageIndex).toBe(2)
  })
})
