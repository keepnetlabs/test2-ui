jest.mock('@/api/quishing', () => ({
  getLandingPageTemplates: jest.fn(() => Promise.resolve({ data: { data: [] } })),
  getLandingPageTemplate: jest.fn(() => Promise.resolve()),
  deleteLandingPageTemplate: jest.fn(() => Promise.resolve()),
  bulkDeleteLandingPageTemplates: jest.fn(() => Promise.resolve())
}))

import QuishingLandingPageTemplates from '@/components/QuishingLandingPageTemplates/QuishingLandingPageTemplates.vue'

describe('QuishingLandingPageTemplates.vue', () => {
  it('getLandingPageTemplateId returns resourceId when selected', () => {
    const ctx = { selectedLandingPageTemplate: { resourceId: 'lp1' } }
    expect(QuishingLandingPageTemplates.computed.getLandingPageTemplateId.call(ctx)).toBe('lp1')
  })

  it('getLandingPageTemplateId returns empty when no selection', () => {
    const ctx = { selectedLandingPageTemplate: null }
    expect(QuishingLandingPageTemplates.computed.getLandingPageTemplateId.call(ctx)).toBe('')
  })
})
