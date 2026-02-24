import {
  columnFilterCleared,
  isColumnFilterActive,
  downloadExportedFile,
  createCustomFieldColumns,
  getAvailableForListFromBackend,
  normalizeRoleId,
  getAvailableForValues,
  getAvailableForValueFromList,
  columnFilterChanged
} from '@/utils/helperFunctions'

describe('helperFunctions.js (extra coverage)', () => {
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
    it('extracts code and removes spaces', () => {
      expect(normalizeRoleId({ code: 'Admin Role' })).toBe('AdminRole')
    })
    it('returns empty when no id/code in object', () => {
      expect(normalizeRoleId({})).toBe('')
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
  })
})
