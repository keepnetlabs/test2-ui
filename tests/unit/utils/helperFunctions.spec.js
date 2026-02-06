import {
  getAvailableForListFromBackend,
  normalizeRoleId,
  getAvailableForValues,
  getAvailableForValueFromList,
  columnFilterChanged
} from '@/utils/helperFunctions'

describe('Helper Functions Utility', () => {
  describe('getAvailableForListFromBackend', () => {
    it('should return empty array for empty input', () => {
      expect(getAvailableForListFromBackend()).toEqual([])
      expect(getAvailableForListFromBackend([])).toEqual([])
    })

    it('should transform MyCompanyOnly type', () => {
      const input = [
        { typeName: 'MyCompanyOnly', targetName: 'Company A', targetResourceId: '123' }
      ]
      const result = getAvailableForListFromBackend(input)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        id: 'MyCompanyOnly',
        type: 'MyCompanyOnly',
        resourceId: null,
        label: 'My company only',
        isDisabled: true
      })
    })

    it('should transform AllCompanies type', () => {
      const input = [
        { typeName: 'AllCompanies', targetName: 'All', targetResourceId: '456' }
      ]
      const result = getAvailableForListFromBackend(input)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        id: 'AllCompanies',
        type: 'AllCompanies',
        resourceId: null,
        label: 'All companies',
        isDisabled: true
      })
    })

    it('should transform custom company type', () => {
      const input = [
        { typeName: 'Company', targetName: 'Acme Corp', targetResourceId: 'acme-123' }
      ]
      const result = getAvailableForListFromBackend(input)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        id: 'acme-123',
        type: 'Company',
        resourceId: 'acme-123',
        label: 'Acme Corp',
        isDisabled: false
      })
    })

    it('should transform multiple items', () => {
      const input = [
        { typeName: 'MyCompanyOnly', targetName: 'Company A', targetResourceId: '123' },
        { typeName: 'Company', targetName: 'Acme Corp', targetResourceId: 'acme-123' },
        { typeName: 'AllCompanies', targetName: 'All', targetResourceId: '456' }
      ]
      const result = getAvailableForListFromBackend(input)

      expect(result).toHaveLength(3)
      expect(result[0].id).toBe('MyCompanyOnly')
      expect(result[1].id).toBe('acme-123')
      expect(result[2].id).toBe('AllCompanies')
    })
  })

  describe('normalizeRoleId', () => {
    it('should return empty string for null or undefined', () => {
      expect(normalizeRoleId(null)).toBe('')
      expect(normalizeRoleId(undefined)).toBe('')
    })

    it('should convert string role to string', () => {
      expect(normalizeRoleId('admin')).toBe('admin')
      expect(normalizeRoleId('user')).toBe('user')
    })

    it('should convert number role to string', () => {
      expect(normalizeRoleId(123)).toBe('123')
      expect(normalizeRoleId(0)).toBe('0')
    })

    it('should extract id from object', () => {
      expect(normalizeRoleId({ id: '789' })).toBe('789')
      expect(normalizeRoleId({ id: 456 })).toBe('456')
    })

    it('should extract roleId as fallback', () => {
      expect(normalizeRoleId({ roleId: 'role-123' })).toBe('role-123')
    })

    it('should extract resourceId as fallback', () => {
      expect(normalizeRoleId({ resourceId: 'res-456' })).toBe('res-456')
    })

    it('should extract targetAudienceId as fallback', () => {
      expect(normalizeRoleId({ targetAudienceId: 'aud-789' })).toBe('aud-789')
    })

    it('should extract code and remove spaces', () => {
      expect(normalizeRoleId({ code: 'admin role' })).toBe('adminrole')
      expect(normalizeRoleId({ code: 'user' })).toBe('user')
    })

    it('should extract roleName and remove spaces', () => {
      expect(normalizeRoleId({ roleName: 'super admin' })).toBe('superadmin')
    })

    it('should return empty string for empty object', () => {
      expect(normalizeRoleId({})).toBe('')
    })

    it('should prefer id over other fields', () => {
      const role = {
        id: 'id-123',
        roleId: 'roleId-456',
        code: 'CODE'
      }
      expect(normalizeRoleId(role)).toBe('id-123')
    })
  })

  describe('getAvailableForValues', () => {
    it('should return empty array for empty input', () => {
      expect(getAvailableForValues([])).toEqual([])
    })

    it('should transform MyCompanyOnly type', () => {
      const input = [
        { resourceId: 'res-123', type: 'MyCompanyOnly', id: 'id-123' }
      ]
      const result = getAvailableForValues(input)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        resourceId: null,
        type: 'MyCompanyOnly'
      })
    })

    it('should transform AllCompanies type', () => {
      const input = [
        { resourceId: 'res-456', type: 'AllCompanies', id: 'id-456' }
      ]
      const result = getAvailableForValues(input)

      expect(result).toHaveLength(1)
      expect(result[0].type).toBe('AllCompanies')
      // When resourceId is null, falls back to id
      expect(result[0].resourceId).toBe('id-456')
    })

    it('should transform custom type preserving resourceId', () => {
      const input = [
        { resourceId: 'res-789', type: 'Company', id: 'id-789' }
      ]
      const result = getAvailableForValues(input)

      expect(result[0]).toEqual({
        resourceId: 'res-789',
        type: 'Company'
      })
    })

    it('should use id as fallback for resourceId', () => {
      const input = [
        { type: 'Company', id: 'fallback-id' }
      ]
      const result = getAvailableForValues(input)

      expect(result[0]).toEqual({
        resourceId: 'fallback-id',
        type: 'Company'
      })
    })

    it('should handle multiple items', () => {
      const input = [
        { resourceId: 'res-1', type: 'Company', id: 'id-1' },
        { resourceId: 'res-2', type: 'MyCompanyOnly', id: 'id-2' },
        { resourceId: 'res-3', type: 'AllCompanies', id: 'id-3' }
      ]
      const result = getAvailableForValues(input)

      expect(result).toHaveLength(3)
      expect(result[0].resourceId).toBe('res-1')
      expect(result[0].type).toBe('Company')
      // MyCompanyOnly sets both resourceId and id to null
      expect(result[1].resourceId).toBeNull()
      expect(result[1].type).toBe('MyCompanyOnly')
      expect(result[2].resourceId).toBe('id-3')
      expect(result[2].type).toBe('AllCompanies')
    })
  })

  describe('getAvailableForValueFromList', () => {
    it('should return default MyCompanyOnly for empty list', () => {
      const result = getAvailableForValueFromList([])

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        id: 'MyCompanyOnly',
        label: 'My company only',
        type: 'MyCompanyOnly',
        resourceId: null
      })
    })

    it('should return default MyCompanyOnly for undefined list', () => {
      const result = getAvailableForValueFromList()

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('MyCompanyOnly')
    })

    it('should use backend list when provided', () => {
      const list = [
        { typeName: 'Company', targetName: 'Acme', targetResourceId: 'acme-123' }
      ]
      const result = getAvailableForValueFromList(list)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        id: 'acme-123',
        type: 'Company',
        resourceId: 'acme-123',
        label: 'Acme',
        isDisabled: false
      })
    })

    it('should include multiple companies from backend', () => {
      const list = [
        { typeName: 'Company', targetName: 'Acme', targetResourceId: 'acme-123' },
        { typeName: 'Company', targetName: 'TechCorp', targetResourceId: 'tech-456' }
      ]
      const result = getAvailableForValueFromList(list)

      expect(result).toHaveLength(2)
      expect(result[0].label).toBe('Acme')
      expect(result[1].label).toBe('TechCorp')
    })
  })

  describe('columnFilterChanged', () => {
    it('should add new filter to existing request body', () => {
      const axiosPayload = {
        filter: {
          FilterGroups: [
            {
              FilterItems: [
                { FieldName: 'Status', Value: 'active' }
              ]
            }
          ]
        }
      }
      const newFilter = { FieldName: 'Name', Value: 'John' }

      const result = columnFilterChanged(newFilter, axiosPayload)

      expect(result).toHaveLength(2)
      expect(result).toContainEqual({ FieldName: 'Status', Value: 'active' })
      expect(result).toContainEqual({ FieldName: 'Name', Value: 'John' })
    })

    it('should replace filter with same FieldName', () => {
      const axiosPayload = {
        filter: {
          FilterGroups: [
            {
              FilterItems: [
                { FieldName: 'Status', Value: 'active' },
                { FieldName: 'Name', Value: 'Old' }
              ]
            }
          ]
        }
      }
      const newFilter = { FieldName: 'Name', Value: 'New' }

      const result = columnFilterChanged(newFilter, axiosPayload)

      expect(result).toHaveLength(2)
      expect(result).toContainEqual({ FieldName: 'Status', Value: 'active' })
      expect(result).toContainEqual({ FieldName: 'Name', Value: 'New' })
    })

    it('should handle array of filters', () => {
      const axiosPayload = {
        filter: {
          FilterGroups: [
            {
              FilterItems: [
                { FieldName: 'Status', Value: 'active' }
              ]
            }
          ]
        }
      }
      const newFilters = [
        { FieldName: 'Name', Value: 'John' },
        { FieldName: 'Age', Value: '30' }
      ]

      const result = columnFilterChanged(newFilters, axiosPayload)

      expect(result.length).toBeGreaterThanOrEqual(3)
      expect(result).toContainEqual({ FieldName: 'Status', Value: 'active' })
    })

    it('should handle empty filter items', () => {
      const axiosPayload = {
        filter: {
          FilterGroups: [
            {
              FilterItems: []
            }
          ]
        }
      }
      const newFilter = { FieldName: 'Name', Value: 'John' }

      const result = columnFilterChanged(newFilter, axiosPayload)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual(newFilter)
    })
  })

  describe('Integration', () => {
    it('should transform backend data to frontend format', () => {
      const backendList = [
        { typeName: 'MyCompanyOnly', targetName: 'My Company', targetResourceId: '1' },
        { typeName: 'Company', targetName: 'Partner A', targetResourceId: 'p-123' }
      ]

      const frontendList = getAvailableForListFromBackend(backendList)
      const values = getAvailableForValues(frontendList)

      expect(frontendList).toHaveLength(2)
      expect(values).toHaveLength(2)
      expect(values[0].resourceId).toBeNull()
      expect(values[1].resourceId).toBe('p-123')
    })
  })

  describe('All exported functions', () => {
    it('should export all helper functions', () => {
      expect(typeof getAvailableForListFromBackend).toBe('function')
      expect(typeof normalizeRoleId).toBe('function')
      expect(typeof getAvailableForValues).toBe('function')
      expect(typeof getAvailableForValueFromList).toBe('function')
      expect(typeof columnFilterChanged).toBe('function')
    })
  })
})
