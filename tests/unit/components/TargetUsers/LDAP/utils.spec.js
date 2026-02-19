jest.mock('@/utils/functions', () => ({
  getDefaultAxiosPayload: jest.fn((payload = {}) => ({
    pageNumber: 1,
    pageSize: 10,
    orderBy: 'CreateTime',
    ascending: false,
    filter: {
      Condition: 'AND',
      FilterGroups: [
        { Condition: 'AND', FilterItems: [], FilterGroups: [] },
        { Condition: 'OR', FilterItems: [], FilterGroups: [] }
      ]
    },
    ...payload
  }))
}))

import { getAxiosPayloadOfManuallyTable } from '@/components/TargetUsers/LDAP/utils'

describe('TargetUsers LDAP utils', () => {
  it('builds payload with hideFilter true', () => {
    const payload = getAxiosPayloadOfManuallyTable(true)
    expect(payload.pageSize).toBe(5)
  })

  it('builds payload with default status filter when hideFilter false', () => {
    const payload = getAxiosPayloadOfManuallyTable(false)
    expect(payload.filter.FilterGroups[0].FilterItems[0]).toEqual({
      FieldName: 'Status',
      Operator: 'Include',
      Value: 'New,Exists,Error'
    })
  })

  it('appends custom filter items using selected operator index', () => {
    const payload = getAxiosPayloadOfManuallyTable(false, {
      operator: '1',
      items: [{ FieldName: 'Name', Operator: 'Contains', Value: 'john' }]
    })
    expect(payload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'Name', Operator: 'Contains', Value: 'john' }
    ])
  })
})
