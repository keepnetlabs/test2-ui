import {
  normalizeSearchFilterItems,
  resolveApiDurationFieldName
} from '@/utils/searchFilterNormalize'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

describe('searchFilterNormalize (contract)', () => {
  describe('resolveApiDurationFieldName', () => {
    it('maps totalDuration, TotalDuration; preserves other strings', () => {
      expect(resolveApiDurationFieldName(PROPERTY_STORE.TOTAL_DURATION)).toBe('DurationMinutes')
      expect(resolveApiDurationFieldName('TotalDuration')).toBe('DurationMinutes')
      expect(resolveApiDurationFieldName('DurationMinutes')).toBe('DurationMinutes')
      expect(resolveApiDurationFieldName('CompanyName')).toBe('CompanyName')
    })

    it('handles null and undefined', () => {
      expect(resolveApiDurationFieldName(null)).toBeNull()
      expect(resolveApiDurationFieldName(undefined)).toBeUndefined()
    })

    it('leaves empty string and unrelated primitives unchanged', () => {
      expect(resolveApiDurationFieldName('')).toBe('')
      expect(resolveApiDurationFieldName(0)).toBe(0)
    })
  })

  describe('normalizeSearchFilterItems', () => {
    it('returns empty array for empty input', () => {
      expect(normalizeSearchFilterItems()).toEqual([])
      expect(normalizeSearchFilterItems([])).toEqual([])
    })

    it('preserves other keys on items', () => {
      const out = normalizeSearchFilterItems([
        { FieldName: 'TotalDuration', Operator: 'Contains', Value: '1', Extra: true }
      ])
      expect(out[0]).toEqual({
        FieldName: 'DurationMinutes',
        Operator: 'Contains',
        Value: '1',
        Extra: true
      })
    })

    it('maps only FieldName when FieldName is totalDuration', () => {
      const out = normalizeSearchFilterItems([
        { FieldName: PROPERTY_STORE.TOTAL_DURATION, Operator: '=', Value: '5' }
      ])
      expect(out).toEqual([{ FieldName: 'DurationMinutes', Operator: '=', Value: '5' }])
    })

    it('maps both TotalDuration and totalDuration in one batch', () => {
      const out = normalizeSearchFilterItems([
        { FieldName: 'TotalDuration', Operator: 'Contains', Value: 'a' },
        { FieldName: PROPERTY_STORE.TOTAL_DURATION, Operator: 'Contains', Value: 'b' },
        { FieldName: 'TrainingName', Operator: 'Contains', Value: 'c' }
      ])
      expect(out).toEqual([
        { FieldName: 'DurationMinutes', Operator: 'Contains', Value: 'a' },
        { FieldName: 'DurationMinutes', Operator: 'Contains', Value: 'b' },
        { FieldName: 'TrainingName', Operator: 'Contains', Value: 'c' }
      ])
    })

    it('maps duration when only fieldName is set (camelCase)', () => {
      const out = normalizeSearchFilterItems([
        { fieldName: PROPERTY_STORE.TOTAL_DURATION, Operator: 'Contains', Value: '9' }
      ])
      expect(out[0]).toMatchObject({
        FieldName: 'DurationMinutes',
        Operator: 'Contains',
        Value: '9'
      })
      expect(out[0].fieldName).toBe(PROPERTY_STORE.TOTAL_DURATION)
    })

    it('uses FieldName over fieldName when both are present', () => {
      const out = normalizeSearchFilterItems([
        {
          FieldName: 'TrainingName',
          fieldName: PROPERTY_STORE.TOTAL_DURATION,
          Operator: 'Contains',
          Value: 'x'
        }
      ])
      expect(out[0].FieldName).toBe('TrainingName')
    })

    it('does not set FieldName when only fieldName is a non-duration field', () => {
      const out = normalizeSearchFilterItems([
        { fieldName: 'TrainingName', Operator: 'Contains', Value: 'z' }
      ])
      expect(out[0].FieldName).toBeUndefined()
      expect(out[0].fieldName).toBe('TrainingName')
    })
  })
})
