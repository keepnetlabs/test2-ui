import { EMAIL_DELIVERY_TYPES } from '@/components/CampaignManager/AdvancedSettings/utils'

describe('CampaignManager AdvancedSettings utils', () => {
  it('exports email delivery type enums', () => {
    expect(EMAIL_DELIVERY_TYPES).toEqual({
      SMTP: 1,
      DIRECT_EMAIL: 2
    })
  })
})
