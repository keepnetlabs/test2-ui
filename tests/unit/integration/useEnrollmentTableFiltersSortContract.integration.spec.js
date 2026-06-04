/**
 * Enrollment tablolarında sort mixin (useDefaultTableFunctions ile çakışsa genelde bu son sırada kazanır).
 */
import useEnrollmentTableFilters from '@/hooks/enrollments/useEnrollmentTableFilters'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

describe('useEnrollmentTableFilters sort (contract)', () => {
  const { methods } = useEnrollmentTableFilters

  it('sortChanged maps totalDuration to DurationMinutes orderBy', () => {
    const ctx = {
      axiosPayload: { orderBy: 'X', ascending: false },
      callForData: jest.fn()
    }

    methods.sortChanged.call(ctx, {
      order: 'ascending',
      prop: PROPERTY_STORE.TOTAL_DURATION
    })

    expect(ctx.axiosPayload.orderBy).toBe('DurationMinutes')
    expect(ctx.axiosPayload.ascending).toBe(true)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('sortChanged maps TotalDuration (PascalCase) to DurationMinutes orderBy', () => {
    const ctx = {
      axiosPayload: { orderBy: 'X', ascending: true },
      callForData: jest.fn()
    }

    methods.sortChanged.call(ctx, {
      order: 'descending',
      prop: 'TotalDuration'
    })

    expect(ctx.axiosPayload.orderBy).toBe('DurationMinutes')
    expect(ctx.axiosPayload.ascending).toBe(false)
  })

  it('sortChanged leaves other props unchanged', () => {
    const ctx = {
      axiosPayload: { orderBy: 'enrollmentName', ascending: true },
      callForData: jest.fn()
    }

    methods.sortChanged.call(ctx, {
      order: 'descending',
      prop: 'trainingName'
    })

    expect(ctx.axiosPayload.orderBy).toBe('trainingName')
    expect(ctx.axiosPayload.ascending).toBe(false)
  })

  it('sortChanged passes null prop through to orderBy (resolveApiDurationFieldName)', () => {
    const ctx = {
      axiosPayload: { orderBy: 'prior', ascending: true },
      callForData: jest.fn()
    }

    methods.sortChanged.call(ctx, {
      order: 'descending',
      prop: null
    })

    expect(ctx.axiosPayload.orderBy).toBeNull()
    expect(ctx.axiosPayload.ascending).toBe(false)
    expect(ctx.callForData).toHaveBeenCalled()
  })
})
