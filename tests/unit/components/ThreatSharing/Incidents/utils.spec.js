import { getIncidentListPayload } from '@/components/ThreatSharing/Incidents/utils'

describe('ThreatSharing Incidents utils', () => {
  it('builds incident list payload with defaults', () => {
    const payload = getIncidentListPayload()
    expect(payload.pageNumber).toBe(1)
    expect(payload.pageSize).toBe(5)
    expect(payload.orderBy).toBe('PostedTime')
    expect(payload.filter.FilterGroups[1].FilterItems[0].Value).toBe('')
  })

  it('builds incident list payload with custom values', () => {
    const payload = getIncidentListPayload('company-1', 2, 20, 'phish', ['a', 'b'])
    expect(payload.postedCompanyResourceId).toBe('company-1')
    expect(payload.pageNumber).toBe(2)
    expect(payload.pageSize).toBe(20)
    expect(payload.filter.FilterGroups[0].FilterItems[0].Value).toBe('phish')
    expect(payload.filter.FilterGroups[1].FilterItems[0].Value).toBe('a,b')
  })
})
