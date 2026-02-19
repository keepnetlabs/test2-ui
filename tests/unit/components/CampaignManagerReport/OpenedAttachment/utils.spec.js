import { COLUMNS } from '@/components/CampaignManagerReport/OpenedAttachment/utils'

describe('CampaignManagerReport OpenedAttachment utils', () => {
  it('exports opened-attachment columns', () => {
    expect(COLUMNS).toHaveProperty('FIRST_NAME')
    expect(COLUMNS).toHaveProperty('PHISHING_SCENARIO_NAME')
    expect(COLUMNS).toHaveProperty('TIMES_OPENED')
    expect(COLUMNS).toHaveProperty('DELIVERY_STATUS')
    expect(COLUMNS.FIRST_NAME.type).toBe('text')
  })
})
