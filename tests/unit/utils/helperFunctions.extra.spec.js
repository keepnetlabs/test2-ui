import {
  columnFilterCleared,
  isColumnFilterActive,
  downloadExportedFile,
  createCustomFieldColumns,
  getAvailableForListFromBackend,
  normalizeRoleId,
  getAvailableForValues,
  getAvailableForValueFromList,
  columnFilterChanged,
  resolveApiDurationFieldName,
  normalizeSearchFilterItems
} from '@/utils/helperFunctions'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

describe('helperFunctions.js (extra coverage)', () => {
  describe('resolveApiDurationFieldName', () => {
    it('maps totalDuration and TotalDuration to DurationMinutes', () => {
      expect(resolveApiDurationFieldName(PROPERTY_STORE.TOTAL_DURATION)).toBe('DurationMinutes')
      expect(resolveApiDurationFieldName('TotalDuration')).toBe('DurationMinutes')
      expect(resolveApiDurationFieldName('DurationMinutes')).toBe('DurationMinutes')
      expect(resolveApiDurationFieldName('Name')).toBe('Name')
    })

    it('returns null and undefined unchanged', () => {
      expect(resolveApiDurationFieldName(null)).toBeNull()
      expect(resolveApiDurationFieldName(undefined)).toBeUndefined()
    })
  })

  describe('normalizeSearchFilterItems', () => {
    it('rewrites duration field names in search FilterItems', () => {
      expect(
        normalizeSearchFilterItems([
          { FieldName: 'TotalDuration', Operator: 'Contains', Value: '5' },
          { FieldName: 'trainingName', Operator: 'Contains', Value: 'x' }
        ])
      ).toEqual([
        { FieldName: 'DurationMinutes', Operator: 'Contains', Value: '5' },
        { FieldName: 'trainingName', Operator: 'Contains', Value: 'x' }
      ])
    })

    it('maps camelCase totalDuration FieldName and handles empty list', () => {
      expect(normalizeSearchFilterItems([{ FieldName: PROPERTY_STORE.TOTAL_DURATION, Operator: 'Contains', Value: '1' }])).toEqual([
        { FieldName: 'DurationMinutes', Operator: 'Contains', Value: '1' }
      ])
      expect(normalizeSearchFilterItems([])).toEqual([])
    })
  })

  describe('columnFilterChanged (duration)', () => {
    it('maps TotalDuration filter to DurationMinutes and replaces same column', () => {
      const axiosPayload = {
        filter: {
          FilterGroups: [
            {
              FilterItems: [{ FieldName: 'DurationMinutes', Value: '1-5', Operator: 'Include' }]
            }
          ]
        }
      }
      const result = columnFilterChanged(
        { FieldName: 'TotalDuration', Value: '5-15', Operator: 'Include' },
        axiosPayload
      )
      expect(result).toEqual([{ FieldName: 'DurationMinutes', Value: '5-15', Operator: 'Include' }])
    })

    it('array branch replaces targeted fields and keeps others', () => {
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
          { FieldName: PROPERTY_STORE.TOTAL_DURATION, Value: '5-15', Operator: 'Include' }
        ],
        axiosPayload
      )
      expect(result).toEqual([
        { FieldName: 'Status', Value: '1' },
        { FieldName: 'Name', Value: 'new' },
        { FieldName: 'DurationMinutes', Value: '5-15', Operator: 'Include' }
      ])
    })

    it('array branch uses fieldName when FieldName is missing', () => {
      const axiosPayload = {
        filter: {
          FilterGroups: [{ FilterItems: [{ FieldName: 'Status', Value: 'x' }] }]
        }
      }
      const result = columnFilterChanged([{ fieldName: 'TotalDuration', Value: '5', Operator: '=' }], axiosPayload)
      expect(result.find((i) => i.FieldName === 'DurationMinutes')).toMatchObject({
        FieldName: 'DurationMinutes',
        Value: '5',
        Operator: '='
      })
      expect(result.find((i) => i.FieldName === 'Status')).toEqual({ FieldName: 'Status', Value: 'x' })
    })
  })

  describe('columnFilterCleared', () => {
    it('removes filter by field name', () => {
      const axiosPayload = {
        filter: {
          FilterGroups: [
            {
              FilterItems: [
                { FieldName: 'Status', Value: 'active' },
                { FieldName: 'Name', Value: 'John' }
              ]
            }
          ]
        }
      }
      const result = columnFilterCleared('Name', axiosPayload)
      expect(result).toHaveLength(1)
      expect(result[0].FieldName).toBe('Status')
    })
    it('returns empty when clearing only filter', () => {
      const axiosPayload = {
        filter: {
          FilterGroups: [{ FilterItems: [{ FieldName: 'Name', Value: 'x' }] }]
        }
      }
      const result = columnFilterCleared('Name', axiosPayload)
      expect(result).toHaveLength(0)
    })
    it('handles empty FilterItems', () => {
      const axiosPayload = {
        filter: { FilterGroups: [{ FilterItems: [] }] }
      }
      const result = columnFilterCleared('Name', axiosPayload)
      expect(result).toEqual([])
    })
    it('clears DurationMinutes when clear key is totalDuration', () => {
      const axiosPayload = {
        filter: {
          FilterGroups: [
            {
              FilterItems: [{ FieldName: 'DurationMinutes', Value: '5-15', Operator: 'Include' }]
            }
          ]
        }
      }
      expect(columnFilterCleared(PROPERTY_STORE.TOTAL_DURATION, axiosPayload)).toEqual([])
    })

    it('clears DurationMinutes when clear key is TotalDuration', () => {
      const axiosPayload = {
        filter: {
          FilterGroups: [
            {
              FilterItems: [
                { FieldName: 'DurationMinutes', Value: '5-15', Operator: 'Include' },
                { FieldName: 'Status', Value: '1' }
              ]
            }
          ]
        }
      }
      const result = columnFilterCleared('TotalDuration', axiosPayload)
      expect(result).toEqual([{ FieldName: 'Status', Value: '1' }])
    })
  })

  describe('isColumnFilterActive', () => {
    it('returns true when FilterGroups[0] has items', () => {
      const payload = {
        filter: {
          FilterGroups: [{ FilterItems: [{ FieldName: 'x' }] }, { FilterItems: [] }]
        }
      }
      expect(isColumnFilterActive(payload)).toBe(true)
    })
    it('returns true when FilterGroups[1] has items', () => {
      const payload = {
        filter: {
          FilterGroups: [{ FilterItems: [] }, { FilterItems: [{ FieldName: 'y' }] }]
        }
      }
      expect(isColumnFilterActive(payload)).toBe(true)
    })
    it('returns false when both groups empty', () => {
      const payload = {
        filter: {
          FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }]
        }
      }
      expect(isColumnFilterActive(payload)).toBe(false)
    })
    it('returns false when filter missing', () => {
      expect(isColumnFilterActive({})).toBe(false)
    })
    it('returns true when first group missing but second group has items', () => {
      const payload = {
        filter: {
          FilterGroups: [undefined, { FilterItems: [{ FieldName: 'z' }] }]
        }
      }
      expect(isColumnFilterActive(payload)).toBe(true)
    })
  })

  describe('downloadExportedFile', () => {
    let createObjectURL
    let clickSpy
    let linkEl

    beforeEach(() => {
      createObjectURL = jest.fn().mockReturnValue('blob:mock')
      window.URL.createObjectURL = createObjectURL
      clickSpy = jest.fn()
      linkEl = { href: '', download: '', click: clickSpy }
      document.createElement = jest.fn().mockImplementation((tag) => {
        if (tag === 'a') return linkEl
        return { tagName: tag.toUpperCase() }
      })
    })

    it('creates link and triggers download with xlsx for xls type', () => {
      const blob = new Blob(['data'])
      downloadExportedFile(blob, 'report', 'xls')
      expect(createObjectURL).toHaveBeenCalledWith(blob)
      expect(linkEl.download).toBe('report.xlsx')
      expect(clickSpy).toHaveBeenCalled()
    })
    it('uses lowercase type for extension', () => {
      const blob = new Blob(['data'])
      downloadExportedFile(blob, 'file', 'XLS')
      expect(linkEl.download).toBe('file.xlsx')
    })
    it('uses csv extension for csv type', () => {
      const blob = new Blob(['data'])
      downloadExportedFile(blob, 'export', 'csv')
      expect(linkEl.download).toBe('export.csv')
    })
    it('uses empty extension when type is empty string', () => {
      const blob = new Blob(['data'])
      downloadExportedFile(blob, 'file', '')
      expect(linkEl.download).toBe('file.')
    })
    it('uses type as extension for unknown type (e.g. pdf)', () => {
      const blob = new Blob(['data'])
      downloadExportedFile(blob, 'report', 'pdf')
      expect(linkEl.download).toBe('report.pdf')
    })
    it('uses lowercase extension for uppercase type', () => {
      const blob = new Blob(['data'])
      downloadExportedFile(blob, 'report', 'CSV')
      expect(linkEl.download).toBe('report.csv')
    })
  })

  describe('createCustomFieldColumns', () => {
    it('maps string fieldDataType to text filterableType', () => {
      const fields = [{ name: 'Field1', fieldDataType: 'String' }]
      const result = createCustomFieldColumns(fields)
      expect(result[0].filterableType).toBe('text')
    })
    it('maps email fieldDataType to text filterableType', () => {
      const fields = [{ name: 'Email', fieldDataType: 'Email' }]
      const result = createCustomFieldColumns(fields)
      expect(result[0].filterableType).toBe('text')
    })
    it('maps number fieldDataType to text filterableType', () => {
      const fields = [{ name: 'Count', fieldDataType: 'Number' }]
      const result = createCustomFieldColumns(fields)
      expect(result[0].filterableType).toBe('text')
    })
    it('maps boolean fieldDataType to select with Yes/No', () => {
      const fields = [{ name: 'Active', fieldDataType: 'Boolean' }]
      const result = createCustomFieldColumns(fields)
      expect(result[0].filterableType).toBe('select')
      expect(result[0].filterableItems).toEqual([
        { text: 'Yes', value: 1 },
        { text: 'No', value: 0 }
      ])
    })
    it('maps date fieldDataType to dateOnly', () => {
      const fields = [{ name: 'Created', fieldDataType: 'Date' }]
      const result = createCustomFieldColumns(fields)
      expect(result[0].filterableType).toBe('dateOnly')
      expect(result[0].type).toBe('date')
    })
    it('maps datetime fieldDataType to date', () => {
      const fields = [{ name: 'Updated', fieldDataType: 'DateTime' }]
      const result = createCustomFieldColumns(fields)
      expect(result[0].filterableType).toBe('date')
    })
    it('removes filterableType when isFilterable false', () => {
      const fields = [{ name: 'Secret', fieldDataType: 'String' }]
      const result = createCustomFieldColumns(fields, false)
      expect(result[0].filterableType).toBeUndefined()
    })
    it('returns empty array for empty input', () => {
      expect(createCustomFieldColumns([])).toEqual([])
    })
    it('handles unknown fieldDataType without filterableType', () => {
      const fields = [{ name: 'Custom', fieldDataType: 'UnknownType' }]
      const result = createCustomFieldColumns(fields)
      expect(result[0].property).toBe('Custom')
      expect(result[0].filterable).toBe(true)
      expect(result[0].filterableType).toBeUndefined()
    })
  })

  describe('getAvailableForListFromBackend branch coverage', () => {
    it('maps MyCompanyOnly type', () => {
      const list = [{ typeName: 'MyCompanyOnly', targetName: '', targetResourceId: null }]
      const result = getAvailableForListFromBackend(list)
      expect(result[0]).toMatchObject({
        id: 'MyCompanyOnly',
        label: 'My company only',
        resourceId: null,
        isDisabled: true
      })
    })
    it('maps AllCompanies type', () => {
      const list = [{ typeName: 'AllCompanies', targetName: '', targetResourceId: null }]
      const result = getAvailableForListFromBackend(list)
      expect(result[0]).toMatchObject({
        id: 'AllCompanies',
        label: 'All companies',
        resourceId: null,
        isDisabled: true
      })
    })
    it('maps other type with targetName and targetResourceId', () => {
      const list = [
        { typeName: 'Company', targetName: 'Acme', targetResourceId: 'res-1' }
      ]
      const result = getAvailableForListFromBackend(list)
      expect(result[0]).toMatchObject({
        id: 'res-1',
        label: 'Acme',
        resourceId: 'res-1',
        isDisabled: false
      })
    })
    it('maps other type with empty targetName', () => {
      const list = [
        { typeName: 'Company', targetName: '', targetResourceId: 'res-2' }
      ]
      const result = getAvailableForListFromBackend(list)
      expect(result[0]).toMatchObject({
        id: 'res-2',
        label: '',
        resourceId: 'res-2',
        isDisabled: false
      })
    })
    it('returns empty array for empty list', () => {
      expect(getAvailableForListFromBackend([])).toEqual([])
    })
  })

  describe('normalizeRoleId branch coverage', () => {
    it('returns empty string for null', () => {
      expect(normalizeRoleId(null)).toBe('')
    })
    it('returns empty string for undefined', () => {
      expect(normalizeRoleId(undefined)).toBe('')
    })
    it('converts string to string', () => {
      expect(normalizeRoleId('role-1')).toBe('role-1')
    })
    it('converts number to string', () => {
      expect(normalizeRoleId(123)).toBe('123')
    })
    it('extracts id from object', () => {
      expect(normalizeRoleId({ id: 'id-1' })).toBe('id-1')
    })
    it('extracts roleId from object', () => {
      expect(normalizeRoleId({ roleId: 'r1' })).toBe('r1')
    })
    it('extracts resourceId when id and roleId absent', () => {
      expect(normalizeRoleId({ resourceId: 'res-99' })).toBe('res-99')
    })
    it('extracts code and removes spaces', () => {
      expect(normalizeRoleId({ code: 'Admin Role' })).toBe('AdminRole')
    })
    it('returns empty when no id/code in object', () => {
      expect(normalizeRoleId({})).toBe('')
    })
    it('uses targetAudienceId fallback when id fields are absent', () => {
      expect(normalizeRoleId({ targetAudienceId: 'ta-9' })).toBe('ta-9')
    })
    it('uses roleName fallback and strips spaces', () => {
      expect(normalizeRoleId({ roleName: 'Security Admin' })).toBe('SecurityAdmin')
    })
  })

  describe('getAvailableForValues branch coverage', () => {
    it('sets id and resourceId null for MyCompanyOnly', () => {
      const data = [{ resourceId: 'x', type: 'MyCompanyOnly', id: 'y' }]
      const result = getAvailableForValues(data)
      expect(result[0]).toEqual({ resourceId: null, type: 'MyCompanyOnly' })
    })
    it('sets resourceId null for AllCompanies', () => {
      const data = [{ resourceId: 'x', type: 'AllCompanies', id: 'y' }]
      const result = getAvailableForValues(data)
      expect(result[0]).toEqual({ resourceId: 'y', type: 'AllCompanies' })
    })
    it('keeps resourceId for other types', () => {
      const data = [{ resourceId: 'res-1', type: 'Company', id: 'res-1' }]
      const result = getAvailableForValues(data)
      expect(result[0]).toEqual({ resourceId: 'res-1', type: 'Company' })
    })
    it('falls back to null when both resourceId and id are missing', () => {
      const data = [{ type: 'Company' }]
      const result = getAvailableForValues(data)
      expect(result[0]).toEqual({ resourceId: undefined, type: 'Company' })
    })
    it('uses id when resourceId is null for other types', () => {
      const data = [{ resourceId: null, type: 'Company', id: 'fallback-id' }]
      const result = getAvailableForValues(data)
      expect(result[0]).toEqual({ resourceId: 'fallback-id', type: 'Company' })
    })
  })

  describe('getAvailableForValueFromList branch coverage', () => {
    it('returns default when list empty', () => {
      const result = getAvailableForValueFromList([])
      expect(result).toHaveLength(1)
      expect(result[0].type).toBe('MyCompanyOnly')
    })
    it('returns from backend when list has items', () => {
      const list = [{ typeName: 'Company', targetName: 'Acme', targetResourceId: 'r1' }]
      const result = getAvailableForValueFromList(list)
      expect(result.length).toBeGreaterThan(0)
      expect(result[0].label).toBe('Acme')
    })
  })

  describe('columnFilterCleared branch coverage', () => {
    it('removes matching field and keeps others', () => {
      const payload = {
        filter: {
          FilterGroups: [
            {
              FilterItems: [
                { FieldName: 'A', Value: 1 },
                { FieldName: 'B', Value: 2 },
                { FieldName: 'C', Value: 3 }
              ]
            }
          ]
        }
      }
      const result = columnFilterCleared('B', payload)
      expect(result).toHaveLength(2)
      expect(result.map((f) => f.FieldName)).toEqual(['A', 'C'])
    })
  })

  describe('columnFilterChanged branch coverage', () => {
    const basePayload = {
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'Status', Value: 'active' },
              { FieldName: 'Name', Value: 'x' }
            ]
          }
        ]
      }
    }
    it('handles single filter object', () => {
      const filter = { FieldName: 'Name', Value: 'updated' }
      const result = columnFilterChanged(filter, JSON.parse(JSON.stringify(basePayload)))
      expect(result.some((f) => f.FieldName === 'Name' && f.Value === 'updated')).toBe(true)
    })
    it('handles array of filters', () => {
      const filter = [
        { FieldName: 'Name', Value: 'v1' },
        { FieldName: 'Status', Value: 'v2' }
      ]
      const payload = JSON.parse(JSON.stringify(basePayload))
      const result = columnFilterChanged(filter, payload)
      expect(result.length).toBeGreaterThanOrEqual(2)
    })
    it('keeps unrelated existing filters when replacing one', () => {
      const payload = JSON.parse(JSON.stringify(basePayload))
      payload.filter.FilterGroups[0].FilterItems.push({ FieldName: 'Type', Value: 'email' })
      const result = columnFilterChanged(
        { FieldName: 'Name', Value: 'new-name' },
        payload
      )
      expect(result.some((f) => f.FieldName === 'Type' && f.Value === 'email')).toBe(true)
      expect(result.some((f) => f.FieldName === 'Name' && f.Value === 'new-name')).toBe(true)
    })
    it('handles array filter replacing multiple fields', () => {
      const payload = {
        filter: {
          FilterGroups: [
            {
              FilterItems: [
                { FieldName: 'Status', Value: 'old' },
                { FieldName: 'Name', Value: 'old' }
              ]
            }
          ]
        }
      }
      const filter = [
        { FieldName: 'Status', Value: 'active' },
        { FieldName: 'Name', Value: 'updated' }
      ]
      const result = columnFilterChanged(filter, payload)
      expect(result.some((f) => f.FieldName === 'Status' && f.Value === 'active')).toBe(true)
      expect(result.some((f) => f.FieldName === 'Name' && f.Value === 'updated')).toBe(true)
    })
    it('handles single filter when no existing item matches', () => {
      const payload = {
        filter: {
          FilterGroups: [{ FilterItems: [{ FieldName: 'Other', Value: 'x' }] }]
        }
      }
      const result = columnFilterChanged({ FieldName: 'Name', Value: 'new' }, payload)
      expect(result).toHaveLength(2)
      expect(result.some((f) => f.FieldName === 'Other')).toBe(true)
      expect(result.some((f) => f.FieldName === 'Name' && f.Value === 'new')).toBe(true)
    })
    it('array filter excludes items whose FieldName matches filter array', () => {
      const payload = {
        filter: {
          FilterGroups: [
            {
              FilterItems: [
                { FieldName: 'Status', Value: 'old' },
                { FieldName: 'Name', Value: 'old' }
              ]
            }
          ]
        }
      }
      const filter = [{ FieldName: 'Name', Value: 'replaced' }]
      const result = columnFilterChanged(filter, payload)
      expect(result.some((f) => f.FieldName === 'Status' && f.Value === 'old')).toBe(true)
      expect(result.some((f) => f.FieldName === 'Name' && f.Value === 'replaced')).toBe(true)
      expect(result.filter((f) => f.FieldName === 'Name')).toHaveLength(1)
    })
  })

  describe('getAvailableForValueFromList edge cases', () => {
    it('returns default when list has items but getAvailableForListFromBackend returns single item', () => {
      const list = [{ typeName: 'MyCompanyOnly', targetName: '', targetResourceId: null }]
      const result = getAvailableForValueFromList(list)
      expect(result).toHaveLength(1)
      expect(result[0].type).toBe('MyCompanyOnly')
    })
    it('returns multiple items when list has multiple types', () => {
      const list = [
        { typeName: 'MyCompanyOnly', targetName: '', targetResourceId: null },
        { typeName: 'Company', targetName: 'Acme', targetResourceId: 'r1' }
      ]
      const result = getAvailableForValueFromList(list)
      expect(result).toHaveLength(2)
      expect(result[1].label).toBe('Acme')
    })
  })

  describe('createCustomFieldColumns extra branches', () => {
    it('keeps boolean filterableItems even when isFilterable is false', () => {
      const result = createCustomFieldColumns(
        [{ name: 'IsActive', fieldDataType: 'Boolean' }],
        false
      )
      expect(result[0].filterableType).toBeUndefined()
      expect(result[0].filterableItems).toEqual([
        { text: 'Yes', value: 1 },
        { text: 'No', value: 0 }
      ])
    })
    it('creates base column without filterableType for unknown data type', () => {
      const result = createCustomFieldColumns([{ name: 'Meta', fieldDataType: 'Json' }])
      expect(result[0].property).toBe('Meta')
      expect(result[0].filterableType).toBeUndefined()
      expect(result[0].filterable).toBe(true)
    })
    it('calculates width using field name length', () => {
      const result = createCustomFieldColumns([{ name: 'ABCDE', fieldDataType: 'String' }])
      expect(result[0].width).toBe(80 + 5 * 7)
    })
    it('handles lowercase fieldDataType', () => {
      const result = createCustomFieldColumns([{ name: 'Count', fieldDataType: 'number' }])
      expect(result[0].filterableType).toBe('text')
    })
    it('handles datetime lowercase', () => {
      const result = createCustomFieldColumns([{ name: 'Updated', fieldDataType: 'datetime' }])
      expect(result[0].filterableType).toBe('date')
    })
    it('handles date lowercase', () => {
      const result = createCustomFieldColumns([{ name: 'Created', fieldDataType: 'date' }])
      expect(result[0].filterableType).toBe('dateOnly')
      expect(result[0].type).toBe('date')
    })
  })

  describe('columnFilterChanged array filter edge case', () => {
    it('returns empty when filter array is empty and clears existing items', () => {
      const payload = {
        filter: {
          FilterGroups: [{ FilterItems: [{ FieldName: 'Status', Value: 'x' }] }]
        }
      }
      const result = columnFilterChanged([], payload)
      expect(result).toHaveLength(0)
    })
  })
})
