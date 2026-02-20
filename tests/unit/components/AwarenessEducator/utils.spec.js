import {
  EMITS,
  TRAINING_TYPES,
  ENROLLMENT_STATUSES,
  ENROLLMENT_STATUSES_FILTER,
  COLUMNS,
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

  it('keeps enrollment status filter aligned with status constants', () => {
    expect(ENROLLMENT_STATUSES_FILTER).toEqual(
      expect.arrayContaining([
        ENROLLMENT_STATUSES.AUTO_ENROLL,
        ENROLLMENT_STATUSES.SENDING,
        ENROLLMENT_STATUSES.FINISHED,
        ENROLLMENT_STATUSES.SCHEDULED,
        ENROLLMENT_STATUSES.PAUSED,
        ENROLLMENT_STATUSES.ERROR,
        ENROLLMENT_STATUSES.DELETED
      ])
    )
    expect(ENROLLMENT_STATUSES_FILTER).not.toContain(ENROLLMENT_STATUSES.ARCHIVED)
  })

  it('defines language and status columns with expected shape', () => {
    expect(COLUMNS.LANGUAGES.type).toBe('slot')
    expect(COLUMNS.LANGUAGES.hasTooltip).toBe(true)
    expect(COLUMNS.STATUS.type).toBe('badge')
    expect(COLUMNS.STATUS.filterableItems).toBe(ENROLLMENT_STATUSES_FILTER)
  })

  it('defines enrollment type and delivery type column filters', () => {
    expect(COLUMNS.ENROLLMENT_TYPE.filterableType).toBe('select')
    expect(COLUMNS.ENROLLMENT_TYPE.filterableItems).toHaveLength(6)
    expect(COLUMNS.ENROLLMENT_TYPE.filterableItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ text: 'Training', value: 1 }),
        expect.objectContaining({ text: 'Poster', value: 3 }),
        expect.objectContaining({ text: 'LearningPath', value: 6 })
      ])
    )

    expect(COLUMNS.DELIVERY_TYPE.filterableItems).toEqual([
      'Email',
      'Email & SMS',
      'Email & Microsoft Teams'
    ])
  })

  it('keeps derived enrollment audience settings from base audience column', () => {
    expect(ENROLLMENT_AUDIENCE.property).toBe(COLUMNS.AUDIENCE.property)
    expect(ENROLLMENT_AUDIENCE.label).toBe(COLUMNS.AUDIENCE.label)
    expect(ENROLLMENT_AUDIENCE.type).toBe(COLUMNS.AUDIENCE.type)
  })

  it('defines scheduled and trash status filter variants correctly', () => {
    expect(COLUMNS.STATUS_SCHEDULED.type).toBe('slot')
    expect(COLUMNS.STATUS_SCHEDULED.filterableItems).toEqual([
      { text: 'Active', value: 1 },
      { text: 'Inactive', value: 0 }
    ])

    expect(COLUMNS.STATUS_TRASH.type).toBe('badge')
    expect(COLUMNS.STATUS_TRASH.filterableItems).toEqual(['Archived'])
  })

  it('keeps target users and frequency filter definitions stable', () => {
    expect(COLUMNS.TARGET_USERS.filterableType).toBe('select')
    expect(COLUMNS.TARGET_USERS.filterableItems).toEqual([
      { text: 'User Group', value: 'UserGroup' },
      'Campaign'
    ])

    expect(COLUMNS.FREQUENCY.filterableType).toBe('select')
    expect(COLUMNS.FREQUENCY.filterableItems).toEqual([
      { text: 'One Time', value: 0 },
      { text: 'Weekly', value: 1 },
      { text: 'Every two weeks', value: 2 },
      { text: 'Monthly', value: 3 },
      { text: 'Quarterly', value: 4 }
    ])
  })

  it('keeps date columns configured as date filters', () => {
    expect(COLUMNS.DATE_CREATED.filterableType).toBe('date')
    expect(COLUMNS.LAST_SEND_DATE.filterableType).toBe('date')
    expect(COLUMNS.NEXT_SEND_DATE.filterableType).toBe('date')
    expect(COLUMNS.START_DATE.filterableType).toBe('date')
    expect(COLUMNS.CREATE_TIME.filterableType).toBe('date')
  })
})
