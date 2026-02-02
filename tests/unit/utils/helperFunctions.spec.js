import * as HelperFunctions from '@/utils/helperFunctions'

describe('helperFunctions.js', () => {
  describe('getAvailableForListFromBackend', () => {
    it('transforms MyCompanyOnly type', () => {
      const input = [
        {
          typeName: 'MyCompanyOnly',
          targetName: 'Company A',
          targetResourceId: '123'
        }
      ]
      const result = HelperFunctions.getAvailableForListFromBackend(input)

      expect(result[0]).toEqual({
        id: 'MyCompanyOnly',
        type: 'MyCompanyOnly',
        resourceId: null,
        label: 'My company only',
        isDisabled: true
      })
    })

    it('transforms AllCompanies type', () => {
      const input = [
        {
          typeName: 'AllCompanies',
          targetName: 'All',
          targetResourceId: 'all'
        }
      ]
      const result = HelperFunctions.getAvailableForListFromBackend(input)

      expect(result[0]).toEqual({
        id: 'AllCompanies',
        type: 'AllCompanies',
        resourceId: null,
        label: 'All companies',
        isDisabled: true
      })
    })

    it('transforms regular company type', () => {
      const input = [
        {
          typeName: 'Company',
          targetName: 'My Company',
          targetResourceId: 'company-123'
        }
      ]
      const result = HelperFunctions.getAvailableForListFromBackend(input)

      expect(result[0]).toEqual({
        id: 'company-123',
        type: 'Company',
        resourceId: 'company-123',
        label: 'My Company',
        isDisabled: false
      })
    })

    it('handles empty array', () => {
      const result = HelperFunctions.getAvailableForListFromBackend([])
      expect(result).toEqual([])
    })

    it('handles multiple items', () => {
      const input = [
        { typeName: 'MyCompanyOnly', targetName: 'Company A', targetResourceId: '123' },
        { typeName: 'Company', targetName: 'Company B', targetResourceId: '456' }
      ]
      const result = HelperFunctions.getAvailableForListFromBackend(input)

      expect(result.length).toBe(2)
      expect(result[0].isDisabled).toBe(true)
      expect(result[1].isDisabled).toBe(false)
    })
  })

  describe('normalizeRoleId', () => {
    it('returns empty string for null/undefined', () => {
      expect(HelperFunctions.normalizeRoleId(null)).toBe('')
      expect(HelperFunctions.normalizeRoleId(undefined)).toBe('')
    })

    it('converts string role to string', () => {
      expect(HelperFunctions.normalizeRoleId('admin')).toBe('admin')
    })

    it('converts number role to string', () => {
      expect(HelperFunctions.normalizeRoleId(123)).toBe('123')
    })

    it('extracts id from object with id property', () => {
      expect(HelperFunctions.normalizeRoleId({ id: '456' })).toBe('456')
    })

    it('extracts id from object with roleId property', () => {
      expect(HelperFunctions.normalizeRoleId({ roleId: '789' })).toBe('789')
    })

    it('extracts id from object with resourceId property', () => {
      expect(HelperFunctions.normalizeRoleId({ resourceId: '999' })).toBe('999')
    })

    it('extracts id from object with targetAudienceId property', () => {
      expect(HelperFunctions.normalizeRoleId({ targetAudienceId: '111' })).toBe('111')
    })

    it('prioritizes id > roleId > resourceId > targetAudienceId', () => {
      const obj = { id: '1', roleId: '2', resourceId: '3', targetAudienceId: '4' }
      expect(HelperFunctions.normalizeRoleId(obj)).toBe('1')
    })

    it('extracts code and removes spaces', () => {
      expect(HelperFunctions.normalizeRoleId({ code: 'admin role' })).toBe('adminrole')
    })

    it('extracts roleName and removes spaces', () => {
      expect(HelperFunctions.normalizeRoleId({ roleName: 'user role' })).toBe('userrole')
    })

    it('returns empty string when no valid properties', () => {
      expect(HelperFunctions.normalizeRoleId({ name: 'test' })).toBe('')
    })
  })

  describe('getAvailableForValues', () => {
    it('transforms data array correctly', () => {
      const input = [
        { resourceId: '123', type: 'Company', id: '456' },
        { resourceId: '789', type: 'Department', id: '999' }
      ]
      const result = HelperFunctions.getAvailableForValues(input)

      expect(result).toEqual([
        { resourceId: '123', type: 'Company' },
        { resourceId: '789', type: 'Department' }
      ])
    })

    it('sets resourceId to null for MyCompanyOnly type', () => {
      const input = [
        { resourceId: '123', type: 'MyCompanyOnly', id: '456' }
      ]
      const result = HelperFunctions.getAvailableForValues(input)

      expect(result[0]).toEqual({
        resourceId: null,
        type: 'MyCompanyOnly'
      })
    })

    it('sets resourceId to null only for AllCompanies but keeps id', () => {
      const input = [
        { resourceId: '123', type: 'AllCompanies', id: '456' }
      ]
      const result = HelperFunctions.getAvailableForValues(input)

      // AllCompanies only nullifies resourceId, but the function returns resourceId || id
      expect(result[0].type).toBe('AllCompanies')
      expect(result[0].resourceId).toBe('456') // Falls back to id
    })

    it('uses id as resourceId when resourceId is null', () => {
      const input = [
        { resourceId: null, type: 'Company', id: '456' }
      ]
      const result = HelperFunctions.getAvailableForValues(input)

      expect(result[0].resourceId).toBe('456')
    })
  })

  describe('getAvailableForValueFromList', () => {
    it('returns default MyCompanyOnly when list is empty', () => {
      const result = HelperFunctions.getAvailableForValueFromList([])

      expect(result.length).toBe(1)
      expect(result[0]).toEqual({
        id: 'MyCompanyOnly',
        label: 'My company only',
        type: 'MyCompanyOnly',
        resourceId: null
      })
    })

    it('returns transformed data when list has items', () => {
      const input = [
        { typeName: 'Company', targetName: 'Company A', targetResourceId: '123' }
      ]
      const result = HelperFunctions.getAvailableForValueFromList(input)

      expect(result.length).toBe(1)
      expect(result[0].type).toBe('Company')
      expect(result[0].label).toBe('Company A')
    })

    it('handles empty list parameter', () => {
      const result = HelperFunctions.getAvailableForValueFromList()
      expect(result[0].type).toBe('MyCompanyOnly')
    })
  })

  describe('columnFilterChanged', () => {
    it('adds new filter to request body', () => {
      const axiosPayload = {
        filter: {
          FilterGroups: [
            { FilterItems: [{ FieldName: 'Status', Value: 'Active' }] }
          ]
        }
      }
      const newFilter = { FieldName: 'Name', Value: 'Test' }
      const result = HelperFunctions.columnFilterChanged(newFilter, axiosPayload)

      expect(result.length).toBe(2)
      expect(result[1].FieldName).toBe('Name')
    })

    it('removes existing filter of same field', () => {
      const axiosPayload = {
        filter: {
          FilterGroups: [
            {
              FilterItems: [
                { FieldName: 'Status', Value: 'Active' },
                { FieldName: 'Name', Value: 'Old' }
              ]
            }
          ]
        }
      }
      const newFilter = { FieldName: 'Name', Value: 'New' }
      const result = HelperFunctions.columnFilterChanged(newFilter, axiosPayload)

      expect(result.length).toBe(2)
      expect(result.filter(f => f.FieldName === 'Name')[0].Value).toBe('New')
    })

    it('handles array of filters', () => {
      const axiosPayload = {
        filter: {
          FilterGroups: [
            { FilterItems: [{ FieldName: 'Status', Value: 'Active' }] }
          ]
        }
      }
      const filters = [
        { FieldName: 'Name', Value: 'Test1' },
        { FieldName: 'Email', Value: 'test@test.com' }
      ]
      const result = HelperFunctions.columnFilterChanged(filters, axiosPayload)

      // When passing array of filters, all existing non-matching filters + new filters are included
      expect(result.length).toBe(4)
      const fieldNames = result.map(f => f.FieldName)
      expect(fieldNames).toContain('Status')
      expect(fieldNames).toContain('Name')
      expect(fieldNames).toContain('Email')
    })
  })

  describe('columnFilterCleared', () => {
    it('removes filter by field name', () => {
      const axiosPayload = {
        filter: {
          FilterGroups: [
            {
              FilterItems: [
                { FieldName: 'Status', Value: 'Active' },
                { FieldName: 'Name', Value: 'Test' }
              ]
            }
          ]
        }
      }
      const result = HelperFunctions.columnFilterCleared('Status', axiosPayload)

      expect(result.length).toBe(1)
      expect(result[0].FieldName).toBe('Name')
    })

    it('returns all items when field not found', () => {
      const axiosPayload = {
        filter: {
          FilterGroups: [
            {
              FilterItems: [
                { FieldName: 'Status', Value: 'Active' }
              ]
            }
          ]
        }
      }
      const result = HelperFunctions.columnFilterCleared('NonExistent', axiosPayload)

      expect(result.length).toBe(1)
    })

    it('returns empty array when clearing only filter', () => {
      const axiosPayload = {
        filter: {
          FilterGroups: [
            {
              FilterItems: [
                { FieldName: 'Status', Value: 'Active' }
              ]
            }
          ]
        }
      }
      const result = HelperFunctions.columnFilterCleared('Status', axiosPayload)

      expect(result.length).toBe(0)
    })
  })

  describe('isColumnFilterActive', () => {
    it('returns true when FilterGroup 0 has FilterItems', () => {
      const axiosPayload = {
        filter: {
          FilterGroups: [
            { FilterItems: [{ FieldName: 'Status' }] },
            { FilterItems: [] }
          ]
        }
      }
      const result = HelperFunctions.isColumnFilterActive(axiosPayload)
      expect(result).toBe(true)
    })

    it('returns true when FilterGroup 1 has FilterItems', () => {
      const axiosPayload = {
        filter: {
          FilterGroups: [
            { FilterItems: [] },
            { FilterItems: [{ FieldName: 'Status' }] }
          ]
        }
      }
      const result = HelperFunctions.isColumnFilterActive(axiosPayload)
      expect(result).toBe(true)
    })

    it('returns false when both FilterGroups are empty', () => {
      const axiosPayload = {
        filter: {
          FilterGroups: [
            { FilterItems: [] },
            { FilterItems: [] }
          ]
        }
      }
      const result = HelperFunctions.isColumnFilterActive(axiosPayload)
      expect(result).toBe(false)
    })

    it('returns false for empty payload', () => {
      const result = HelperFunctions.isColumnFilterActive({})
      expect(result).toBe(false)
    })
  })

  describe('createCustomFieldColumns', () => {
    it('creates column for string field type', () => {
      const input = [
        { name: 'FirstName', fieldDataType: 'string' }
      ]
      const result = HelperFunctions.createCustomFieldColumns(input)

      expect(result[0].property).toBe('FirstName')
      expect(result[0].filterableType).toBe('text')
      expect(result[0].isCustomField).toBe(true)
    })

    it('creates column for email field type', () => {
      const input = [
        { name: 'Email', fieldDataType: 'email' }
      ]
      const result = HelperFunctions.createCustomFieldColumns(input)

      expect(result[0].filterableType).toBe('text')
    })

    it('creates column for number field type', () => {
      const input = [
        { name: 'Age', fieldDataType: 'number' }
      ]
      const result = HelperFunctions.createCustomFieldColumns(input)

      expect(result[0].filterableType).toBe('text')
    })

    it('creates column for boolean field type with select options', () => {
      const input = [
        { name: 'IsActive', fieldDataType: 'boolean' }
      ]
      const result = HelperFunctions.createCustomFieldColumns(input)

      expect(result[0].filterableType).toBe('select')
      expect(result[0].filterableItems).toEqual([
        { text: 'Yes', value: 1 },
        { text: 'No', value: 0 }
      ])
    })

    it('creates column for date field type', () => {
      const input = [
        { name: 'BirthDate', fieldDataType: 'date' }
      ]
      const result = HelperFunctions.createCustomFieldColumns(input)

      expect(result[0].filterableType).toBe('dateOnly')
      expect(result[0].type).toBe('date')
    })

    it('creates column for datetime field type', () => {
      const input = [
        { name: 'CreatedAt', fieldDataType: 'datetime' }
      ]
      const result = HelperFunctions.createCustomFieldColumns(input)

      expect(result[0].filterableType).toBe('date')
    })

    it('removes filterableType when isFilterable is false', () => {
      const input = [
        { name: 'FirstName', fieldDataType: 'string' }
      ]
      const result = HelperFunctions.createCustomFieldColumns(input, false)

      expect(result[0].filterableType).toBeUndefined()
    })

    it('calculates width based on field name length', () => {
      const input = [
        { name: 'A', fieldDataType: 'string' },
        { name: 'VeryLongFieldName', fieldDataType: 'string' }
      ]
      const result = HelperFunctions.createCustomFieldColumns(input)

      expect(result[0].width).toBe(80 + 1 * 7)
      expect(result[1].width).toBe(80 + 17 * 7)
    })

    it('handles empty custom fields array', () => {
      const result = HelperFunctions.createCustomFieldColumns([])
      expect(result).toEqual([])
    })

    it('handles case-insensitive field data type', () => {
      const input = [
        { name: 'Status', fieldDataType: 'BOOLEAN' }
      ]
      const result = HelperFunctions.createCustomFieldColumns(input)

      expect(result[0].filterableType).toBe('select')
    })
  })
})
