import { EMAIL_DELIVERY_TYPES } from '@/components/CampaignManager/AdvancedSettings/utils'

describe('CampaignManager AdvancedSettings utils (extra branching)', () => {
  it('uses distinct numeric codes for SMTP vs direct email', () => {
    expect(EMAIL_DELIVERY_TYPES.SMTP).toBe(1)
    expect(EMAIL_DELIVERY_TYPES.DIRECT_EMAIL).toBe(2)
    expect(new Set(Object.values(EMAIL_DELIVERY_TYPES)).size).toBe(2)
  })
})
