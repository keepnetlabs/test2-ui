import {
  getErrorMessage,
  getDifficultyBadgeColor,
  formatSeconds,
  createRandomCryptNumber,
  getInvestigationStatusTooltipText,
  setSafariClusterFix,
  getDataTableFieldLabel,
  deepCopyArray,
  getDefaultFilter,
  getDefaultAxiosPayload,
  getSelectSearchPayload,
  datePrettier,
  strReverse,
  isDifferent,
  getTimeZone,
  getTimeValueFormatZone,
  getBtnStatusColor,
  getBtnPriorityColor,
  getTextColor,
  getTimeZoneForMoment,
  isOwnerOrMember,
  isOwner
} from '@/utils/functions'

describe('functions.js (extra coverage)', () => {
  describe('getErrorMessage', () => {
    it('returns validationMessages[0] when present', () => {
      const err = {
        response: {
          data: {
            validationMessages: ['First validation error', 'Second']
          }
        }
      }
      expect(getErrorMessage(err)).toBe('First validation error')
    })
    it('returns message when no validationMessages', () => {
      const err = {
        response: { data: { message: 'Server error' } }
      }
      expect(getErrorMessage(err)).toBe('Server error')
    })
    it('returns Message (capital M) when message absent', () => {
      const err = {
        response: { data: { Message: 'Capital M message' } }
      }
      expect(getErrorMessage(err)).toBe('Capital M message')
    })
    it('returns error.message when no response data', () => {
      const err = { message: 'Network error' }
      expect(getErrorMessage(err)).toBe('Network error')
    })
    it('returns default when all absent', () => {
      expect(getErrorMessage({})).toBe('Something Went Wrong')
    })
  })

  describe('getDifficultyBadgeColor', () => {
    it('returns easy color', () => {
      expect(getDifficultyBadgeColor('easy')).toBe('#217124')
      expect(getDifficultyBadgeColor('Easy')).toBe('#217124')
    })
    it('returns medium color', () => {
      expect(getDifficultyBadgeColor('medium')).toBe('#2196f3')
    })
    it('returns hard color', () => {
      expect(getDifficultyBadgeColor('hard')).toBe('#f56c6c')
    })
    it('returns default for unknown', () => {
      expect(getDifficultyBadgeColor('unknown')).toBe('#2196f3')
    })
    it('returns default for empty', () => {
      expect(getDifficultyBadgeColor('')).toBe('#2196f3')
    })
  })

  describe('formatSeconds branch coverage', () => {
    it('returns 00:00 for non-number non-string', () => {
      expect(formatSeconds({})).toBe('00:00')
      expect(formatSeconds(null)).toBe('00:00')
    })
    it('formats string seconds', () => {
      const result = formatSeconds('90')
      expect(result).toMatch(/^\d{2}:\d{2}$/)
    })
  })

  describe('createRandomCryptNumber fallback', () => {
    it('falls back to Date.now when crypto unavailable', () => {
      const origCrypto = window.crypto
      const origMsCrypto = window.msCrypto
      delete window.crypto
      delete window.msCrypto
      const result = createRandomCryptNumber()
      expect(typeof result).toBe('number')
      expect(result).toBeGreaterThanOrEqual(0)
      window.crypto = origCrypto
      window.msCrypto = origMsCrypto
    })
  })

  describe('getInvestigationStatusTooltipText', () => {
    it('returns tooltip for Queued', () => {
      expect(getInvestigationStatusTooltipText('Queued')).toContain('investigation')
    })
    it('returns tooltip for Running', () => {
      expect(getInvestigationStatusTooltipText('Running')).toContain('expiry')
    })
    it('returns tooltip for No match', () => {
      expect(getInvestigationStatusTooltipText('No match')).toContain('match')
    })
    it('returns tooltip for Finished', () => {
      expect(getInvestigationStatusTooltipText('Finished')).toContain('completed')
    })
    it('returns tooltip for Canceled', () => {
      expect(getInvestigationStatusTooltipText('Canceled')).toContain('cancelled')
    })
    it('returns tooltip for Expired', () => {
      expect(getInvestigationStatusTooltipText('Expired')).toContain('expired')
    })
    it('returns undefined for unknown status', () => {
      expect(getInvestigationStatusTooltipText('Unknown')).toBeUndefined()
    })
  })

  describe('setSafariClusterFix', () => {
    it('returns class when column property matches param', () => {
      const obj = { column: { property: 'status' } }
      expect(setSafariClusterFix(obj, 'status')).toBe('safari-cluster-icon-fix')
    })
    it('returns undefined when no match', () => {
      const obj = { column: { property: 'name' } }
      expect(setSafariClusterFix(obj, 'status')).toBeUndefined()
    })
  })

  describe('getDataTableFieldLabel branch coverage', () => {
    it('returns from fieldMap by normalizedField', () => {
      expect(getDataTableFieldLabel('being_analyzed')).toBe('Being Analyzed')
      expect(getDataTableFieldLabel('in_progress')).toBe('In Progress')
    })
    it('returns from fieldMap by compactField', () => {
      expect(getDataTableFieldLabel('veryhigh')).toBe('Very High')
    })
    it('converts camelCase to spaces', () => {
      expect(getDataTableFieldLabel('someCamelCase')).toBe('some Camel Case')
    })
    it('returns field as-is when no match', () => {
      expect(getDataTableFieldLabel('unknown_field')).toBe('unknown_field')
    })
  })

  describe('deepCopyArray and filter helpers', () => {
    it('deepCopyArray returns deep clone', () => {
      const arr = [{ a: 1 }, { b: 2 }]
      const copy = deepCopyArray(arr)
      expect(copy).toEqual(arr)
      expect(copy).not.toBe(arr)
      copy[0].a = 99
      expect(arr[0].a).toBe(1)
    })
    it('getDefaultFilter returns filter structure', () => {
      const filter = getDefaultFilter()
      expect(filter.filter).toBeDefined()
      expect(filter.filter.FilterGroups).toHaveLength(2)
    })
    it('getDefaultAxiosPayload uses defaultOrderBy when null', () => {
      const payload = getDefaultAxiosPayload({})
      expect(payload.orderBy).toBe('CreateTime')
    })
    it('getDefaultAxiosPayload uses custom defaultOrderBy', () => {
      const payload = getDefaultAxiosPayload({}, 'CustomOrder')
      expect(payload.orderBy).toBe('CustomOrder')
    })
    it('getSelectSearchPayload adds search to filter', () => {
      const base = {
        filter: {
          FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }]
        }
      }
      const result = getSelectSearchPayload(base, 'test', 'name')
      expect(result.pageSize).toBe(100)
      expect(result.pageNumber).toBe(1)
      expect(result.filter.FilterGroups[1].FilterItems).toContainEqual(
        expect.objectContaining({ Value: 'test', FieldName: 'name', Operator: 'Contains' })
      )
    })
  })

  describe('datePrettier and strReverse', () => {
    it('datePrettier formats date', () => {
      const result = datePrettier('2024-01-15')
      expect(result).toMatch(/\w+,\s+\w+\s+\d+,\s+\d+/)
    })
    it('strReverse reverses string', () => {
      expect(strReverse('hello')).toBe('olleh')
      expect(strReverse('')).toBe('')
    })
  })

  describe('isDifferent branch coverage', () => {
    it('returns true when a is falsy', () => {
      expect(isDifferent(null, { x: 1 })).toBe(true)
      expect(isDifferent(undefined, { x: 1 })).toBe(true)
    })
    it('returns true when b is falsy', () => {
      expect(isDifferent({ x: 1 }, null)).toBe(true)
    })
    it('returns true when array lengths differ', () => {
      expect(isDifferent({ arr: [1, 2] }, { arr: [1] })).toBe(true)
    })
    it('returns false when objects deeply equal', () => {
      expect(isDifferent({ a: 1 }, { a: 1 })).toBe(false)
    })
  })

  describe('getTimeZone and getTimeValueFormatZone', () => {
    beforeEach(() => {
      localStorage.clear()
    })
    it('getTimeZone returns date format when isDate true', () => {
      localStorage.setItem('selectedDateFormat', 'DD/MM/YYYY')
      expect(getTimeZone(true)).toContain('dd')
    })
    it('getTimeZone uses fallback when localStorage empty', () => {
      const fallback = { dateFormat: 'MM/DD/YYYY', timeFormat: '12h' }
      expect(getTimeZone(false, fallback)).toBeDefined()
    })
    it('getTimeValueFormatZone returns format string', () => {
      localStorage.setItem('selectedDateFormat', 'DD/MM/YYYY')
      localStorage.setItem('selectedTimeFormat', '24h')
      const result = getTimeValueFormatZone()
      expect(result).toContain('dd')
    })
  })

  describe('getBtnStatusColor branch coverage', () => {
    it('converts boolean true to yes', () => {
      expect(getBtnStatusColor(true)).toBe('#1173c1')
    })
    it('converts boolean false to no', () => {
      expect(getBtnStatusColor(false)).toBe('#757575')
    })
    it('keeps number as-is (no toLowerCase)', () => {
      expect(getBtnStatusColor(1)).toBeDefined()
    })
    it('returns default for empty string', () => {
      expect(getBtnStatusColor('')).toBe('#00bcd4')
    })
    it('returns from statusColorMap for known status', () => {
      expect(getBtnStatusColor('active')).toBe('#1173C1')
      expect(getBtnStatusColor('finished')).toBe('#217124')
      expect(getBtnStatusColor('deleted')).toBe('#F56C6C')
    })
    it('returns default for unknown status', () => {
      expect(getBtnStatusColor('unknownstatus')).toBe('#00bcd4')
    })
  })

  describe('getBtnPriorityColor branch coverage', () => {
    it('returns color for active', () => {
      expect(getBtnPriorityColor('active')).toBe('#00bcd4')
    })
    it('returns color for inactive', () => {
      expect(getBtnPriorityColor('inactive')).toBe('#b83a3a')
    })
    it('returns color for high', () => {
      expect(getBtnPriorityColor('high')).toBe('#b6791d')
    })
    it('returns color for very high', () => {
      expect(getBtnPriorityColor('very high')).toBe('#b83a3a')
    })
    it('returns color for veryhigh', () => {
      expect(getBtnPriorityColor('veryhigh')).toBe('#b83a3a')
    })
    it('returns undefined for unknown', () => {
      expect(getBtnPriorityColor('unknown')).toBeUndefined()
    })
  })

  describe('getTextColor branch coverage', () => {
    it('returns color for open', () => {
      expect(getTextColor('open')).toBe('#f56c6c')
    })
    it('returns color for closed', () => {
      expect(getTextColor('closed')).toBe('#43a047')
    })
    it('returns color for low', () => {
      expect(getTextColor('low')).toBe('#e6a23c')
    })
    it('returns undefined for unknown', () => {
      expect(getTextColor('unknown')).toBeUndefined()
    })
  })

  describe('getTimeZoneForMoment branch coverage', () => {
    beforeEach(() => {
      localStorage.clear()
    })
    it('returns format with DD/MM/YYYY when 12h', () => {
      localStorage.setItem('selectedDateFormat', 'DD/MM/YYYY')
      localStorage.setItem('selectedTimeFormat', '12h')
      const result = getTimeZoneForMoment()
      expect(result).toContain('DD')
      expect(result).toContain('hh')
    })
    it('returns format with MM/DD/YYYY', () => {
      localStorage.setItem('selectedDateFormat', 'MM/DD/YYYY')
      localStorage.setItem('selectedTimeFormat', '24h')
      const result = getTimeZoneForMoment()
      expect(result).toContain('MM')
    })
    it('uses fallback when localStorage empty', () => {
      const fallback = { dateFormat: 'YYYY/MM/DD', timeFormat: '12h' }
      const result = getTimeZoneForMoment(fallback)
      expect(result).toContain('YYYY')
    })
  })

  describe('isOwnerOrMember and isOwner', () => {
    it('isOwnerOrMember returns true for 1', () => {
      expect(isOwnerOrMember(1)).toBe(true)
    })
    it('isOwnerOrMember returns true for 2', () => {
      expect(isOwnerOrMember(2)).toBe(true)
    })
    it('isOwnerOrMember returns false for 3', () => {
      expect(isOwnerOrMember(3)).toBe(false)
    })
    it('isOwner returns true for 1', () => {
      expect(isOwner(1)).toBe(true)
    })
    it('isOwner returns false for 2', () => {
      expect(isOwner(2)).toBe(false)
    })
  })

  describe('isDifferent recursive branch coverage', () => {
    it('returns true when nested objects differ', () => {
      expect(isDifferent({ a: { b: 1 } }, { a: { b: 2 } })).toBe(true)
    })
    it('returns false when nested objects equal', () => {
      expect(isDifferent({ a: { b: 1 } }, { a: { b: 1 } })).toBe(false)
    })
    it('returns true when value differs', () => {
      expect(isDifferent({ a: 1 }, { a: 2 })).toBe(true)
    })
  })
})
