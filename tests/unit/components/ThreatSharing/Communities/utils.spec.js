import { privacyList, getAllCommunitiesFilter } from '@/components/ThreatSharing/Communities/utils'

describe('ThreatSharing Communities utils', () => {
  it('exports privacy list', () => {
    expect(privacyList).toEqual([
      { name: 'Public', id: 1 },
      { name: 'Private', id: 2 },
      { name: 'Hidden', id: 3 }
    ])
  })

  it('builds all communities filter payload', () => {
    const filter = getAllCommunitiesFilter('acme', 'industry-1', '2')
    expect(filter.FilterGroups).toHaveLength(3)
    expect(filter.FilterGroups[0].FilterItems[0]).toEqual({
      FieldName: 'CommunityName',
      Operator: 'Contains',
      Value: 'acme'
    })
    expect(filter.FilterGroups[1].FilterItems[0].Value).toBe('industry-1')
    expect(filter.FilterGroups[2].FilterItems[0].FieldName).toBe('PrivacyStatusId')
  })
})
