import {
  difficulties,
  methods,
  PHISHING_SCENARIOS_METHOD_TYPE_BY_ID,
  quishingMethods
} from '@/components/CampaignManager/CampaignManagerInfo/utils'

describe('CampaignManagerInfo utils (extra branching)', () => {
  it('quishingMethods entries are a subset of phishing methods by text (excludes Attachment)', () => {
    const phishingTexts = new Set(methods.map((m) => m.text))
    expect(phishingTexts.has('Attachment')).toBe(true)
    quishingMethods.forEach((q) => {
      expect(phishingTexts.has(q.text)).toBe(true)
    })
    expect(quishingMethods.some((q) => q.text === 'Attachment')).toBe(false)
  })

  it('PHISHING_SCENARIOS_METHOD_TYPE_BY_ID uses distinct ids 1 through 4', () => {
    const values = Object.values(PHISHING_SCENARIOS_METHOD_TYPE_BY_ID)
    expect(new Set(values).size).toBe(values.length)
    expect(Math.min(...values)).toBe(1)
    expect(Math.max(...values)).toBe(4)
  })

  it('difficulties has unique value ids per row', () => {
    const values = difficulties.map((d) => d.value)
    expect(new Set(values).size).toBe(values.length)
  })
})
