import { tlpItems } from '@/components/ThreatSharing/PostIncident/utils'

describe('ThreatSharing PostIncident utils', () => {
  it('exports TLP items with expected values', () => {
    expect(tlpItems).toHaveLength(4)
    expect(tlpItems.map((i) => i.text)).toEqual([
      'TLP: WHITE',
      'TLP: GREEN',
      'TLP: AMBER',
      'TLP: RED'
    ])
    expect(tlpItems[0]).toHaveProperty('cssClass')
    expect(tlpItems[0]).toHaveProperty('desc')
  })
})
