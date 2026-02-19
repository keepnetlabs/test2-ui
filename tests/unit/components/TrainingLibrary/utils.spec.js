import {
  TRAINING_LIBRARY_TYPES,
  distributionDelayTimeTypes,
  emptyTrainingPreviewDialogObj,
  isInavailable,
  getAutoEnrollText
} from '@/components/TrainingLibrary/utils'

describe('TrainingLibrary utils', () => {
  it('exports expected defaults', () => {
    expect(TRAINING_LIBRARY_TYPES.TRAINING).toBe('Training')
    expect(distributionDelayTimeTypes).toHaveLength(3)
    expect(emptyTrainingPreviewDialogObj.type).toBe(TRAINING_LIBRARY_TYPES.TRAINING)
  })

  it('evaluates availability combinations', () => {
    expect(isInavailable([], { availableFor: [] }, 'company-1', 'System')).toBe(false)
    expect(
      isInavailable(
        ['MyCompanyOnly'],
        { availableFor: ['MyCompanyOnly', 'company-1'] },
        'company-1',
        'Acme'
      )
    ).toBe(false)
    expect(isInavailable(['any'], { availableFor: ['AllCompanies'] }, 'company-1', 'Acme')).toBe(false)
    expect(isInavailable(['a', 'b'], { availableFor: ['a', 'b', 'c'] }, 'company-1', 'Acme')).toBe(false)
    expect(isInavailable(['a', 'b'], { availableFor: ['a'] }, 'company-1', 'Acme')).toBe(true)
  })

  it('builds auto enroll text based on type', () => {
    expect(getAutoEnrollText('next', 'Monday', { periodCount: 1 }, 'days')).toBe(
      'Automatically enroll new users on the next Monday'
    )
    expect(getAutoEnrollText('in', 'Monday', { periodCount: 3 }, 'days')).toBe(
      'Automatically enroll new users in 3 days'
    )
    expect(getAutoEnrollText('immediately', 'Monday', { periodCount: 3 }, 'days')).toBe(
      'Automatically enroll new users immediately'
    )
  })
})
