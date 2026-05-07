/**
 * Tarih aralığı: iki FilterItem aynı FieldName — columnFilterChanged dizi dalı.
 */
import { columnFilterChanged } from '@/utils/helperFunctions'

describe('columnFilterChanged date range array (contract)', () => {
  it('replaces both between bounds for createTime', () => {
    const axiosPayload = {
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'createTime', Value: '2025-01-01', Operator: '>=' },
              { FieldName: 'createTime', Value: '2025-01-31', Operator: '<=' },
              { FieldName: 'Status', Value: '1' }
            ]
          }
        ]
      }
    }

    const result = columnFilterChanged(
      [
        { FieldName: 'createTime', Value: '2026-02-01' },
        { FieldName: 'createTime', Value: '2026-02-28' }
      ],
      axiosPayload
    )

    expect(result).toEqual([
      { FieldName: 'Status', Value: '1' },
      { FieldName: 'createTime', Value: '2026-02-01' },
      { FieldName: 'createTime', Value: '2026-02-28' }
    ])
  })
})
