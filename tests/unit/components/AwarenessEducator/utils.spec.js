import {
  EMITS,
  TRAINING_TYPES,
  ENROLLMENT_STATUSES,
  ENROLLMENT_STATUSES_FILTER,
  ENROLLMENT_AUDIENCE,
  DISTRIBUTION_DELAY_TIME_TYPES
} from '@/components/AwarenessEducator/utils'

describe('AwarenessEducator utils', () => {
  it('exports emits and status constants', () => {
    expect(EMITS.ON_ADD).toBe('on-add')
    expect(TRAINING_TYPES.SCORM).toBe('SCORM')
    expect(ENROLLMENT_STATUSES.SENDING).toBe('Sending')
    expect(ENROLLMENT_STATUSES_FILTER).toContain('Paused')
  })

  it('exports derived audience column and distribution delay options', () => {
    expect(ENROLLMENT_AUDIENCE.filterableCustomFieldName).toBe('roles')
    expect(DISTRIBUTION_DELAY_TIME_TYPES).toEqual([
      { text: 'seconds', value: '1' },
      { text: 'minutes', value: '2' },
      { text: 'hours', value: '3' }
    ])
  })
})
