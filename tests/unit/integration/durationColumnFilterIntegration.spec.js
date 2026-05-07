/**
 * @/utils/helperFunctions mock yok — sütun filtresi payload birleştirme (prod davranışı).
 */
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

describe('duration column filter (integration, real helperFunctions)', () => {
  const basePayload = () => ({
    filter: {
      FilterGroups: [
        {
          FilterItems: [
            { FieldName: 'Status', Value: '1', Operator: '=' },
            { FieldName: 'DurationMinutes', Value: '1-5', Operator: 'Include' }
          ]
        }
      ]
    }
  })

  it('replaces DurationMinutes row when new filter uses TotalDuration FieldName', () => {
    const axiosPayload = basePayload()
    const result = columnFilterChanged(
      { FieldName: 'TotalDuration', Value: '15-30', Operator: 'Include' },
      axiosPayload
    )
    expect(result).toEqual([
      { FieldName: 'Status', Value: '1', Operator: '=' },
      { FieldName: 'DurationMinutes', Value: '15-30', Operator: 'Include' }
    ])
  })

  it('array filter replaces both fields and keeps unrelated items', () => {
    const axiosPayload = {
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'Status', Value: '1' },
              { FieldName: 'Name', Value: 'old' },
              { FieldName: 'DurationMinutes', Value: '1-5' }
            ]
          }
        ]
      }
    }
    const result = columnFilterChanged(
      [
        { FieldName: 'Name', Value: 'new' },
        { FieldName: PROPERTY_STORE.TOTAL_DURATION, Value: '30-60', Operator: 'Include' }
      ],
      axiosPayload
    )
    expect(result).toEqual([
      { FieldName: 'Status', Value: '1' },
      { FieldName: 'Name', Value: 'new' },
      { FieldName: 'DurationMinutes', Value: '30-60', Operator: 'Include' }
    ])
  })

  it('columnFilterCleared removes duration with TotalDuration clear key', () => {
    const axiosPayload = basePayload()
    const result = columnFilterCleared('TotalDuration', axiosPayload)
    expect(result).toEqual([{ FieldName: 'Status', Value: '1', Operator: '=' }])
  })

  it('columnFilterCleared removes duration when clear key is totalDuration (PROPERTY_STORE)', () => {
    const axiosPayload = basePayload()
    const result = columnFilterCleared(PROPERTY_STORE.TOTAL_DURATION, axiosPayload)
    expect(result).toEqual([{ FieldName: 'Status', Value: '1', Operator: '=' }])
  })

  it('columnFilterChanged with empty array clears all column FilterItems', () => {
    const axiosPayload = basePayload()
    expect(columnFilterChanged([], axiosPayload)).toEqual([])
  })

  it('single-object filter normalizes duration when only fieldName is set (camelCase)', () => {
    const payload = {
      filter: {
        FilterGroups: [{ FilterItems: [{ FieldName: 'Status', Value: '1', Operator: '=' }] }]
      }
    }
    const result = columnFilterChanged(
      { fieldName: PROPERTY_STORE.TOTAL_DURATION, Value: '1-5', Operator: 'Include' },
      payload
    )
    expect(result[0]).toEqual({ FieldName: 'Status', Value: '1', Operator: '=' })
    expect(result[1]).toMatchObject({
      FieldName: 'DurationMinutes',
      Value: '1-5',
      Operator: 'Include'
    })
    expect(result[1].fieldName).toBe(PROPERTY_STORE.TOTAL_DURATION)
  })
})
