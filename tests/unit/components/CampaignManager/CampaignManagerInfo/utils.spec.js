import {
  methods,
  quishingMethods,
  PHISHING_SCENARIOS_METHOD_TYPE_BY_ID,
  difficulties
} from '@/components/CampaignManager/CampaignManagerInfo/utils'

describe('CampaignManagerInfo utils', () => {
  it('exports phishing and quishing method lists', () => {
    expect(methods).toHaveLength(4)
    expect(quishingMethods).toHaveLength(3)
    expect(methods.map((i) => i.text)).toContain('Attachment')
    expect(quishingMethods.map((i) => i.text)).not.toContain('Attachment')
  })

  it('exports method type ids and difficulty list', () => {
    expect(PHISHING_SCENARIOS_METHOD_TYPE_BY_ID).toEqual({
      CLICK_ONLY: 1,
      DATA_SUBMISSION: 2,
      ATTACHMENT: 3,
      MFA: 4
    })
    expect(difficulties.map((i) => i.text)).toEqual(['Easy', 'Medium', 'Hard'])
  })
})
