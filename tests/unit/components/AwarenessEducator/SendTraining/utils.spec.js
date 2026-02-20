import {
  periodTypeItems,
  endTypeItems,
  endTypeItemsSurvey,
  enrollmentAutoEnrollTypeItems,
  enrollmentAutoEnrollDayOfWeekItems,
  certificateTypeItems,
  awardCertificateTypes
} from '@/components/AwarenessEducator/SendTraining/utils'

describe('AwarenessEducator SendTraining utils', () => {
  it('exports period and end type items with expected options', () => {
    expect(periodTypeItems.map((i) => i.value)).toEqual(['Day', 'Week', 'Month'])
    expect(endTypeItems.some((i) => i.value === 'TrainingCompleted')).toBe(true)
    expect(endTypeItems.some((i) => i.value === 'AfterOccurrences')).toBe(true)
    expect(endTypeItemsSurvey.map((i) => i.value)).toEqual([
      'TrainingCompleted',
      'AfterOccurrences',
      'OnDate'
    ])
  })

  it('exports auto-enroll related options', () => {
    expect(enrollmentAutoEnrollTypeItems.map((i) => i.value)).toEqual([
      'SameDay',
      'NextDay',
      'Next',
      'In'
    ])
    expect(enrollmentAutoEnrollDayOfWeekItems).toHaveLength(7)
    expect(enrollmentAutoEnrollDayOfWeekItems[0].text).toBe('Sunday')
    expect(enrollmentAutoEnrollDayOfWeekItems[6].value).toBe(6)
  })

  it('exports certificate type options', () => {
    expect(certificateTypeItems).toEqual([
      { text: 'on the first attempt', value: 'SendOnFirstAttempt' },
      { text: 'on any attempt', value: 'SendOnAnyAttempt' }
    ])
    expect(awardCertificateTypes.map((i) => i.value)).toEqual([
      'SendOnFirstAttempt',
      'SendOnAnyAttempt'
    ])
  })

  it('keeps end type items order and labels stable', () => {
    expect(endTypeItems).toEqual([
      { text: 'when user completes the training', value: 'TrainingCompleted' },
      { text: 'when user completes the quiz', value: 'QuizCompleted' },
      { text: 'when user successfully passes the quiz', value: 'QuizSuccessfullyCompleted' },
      { text: 'after occurences', value: 'AfterOccurrences' },
      { text: 'on date', value: 'OnDate' }
    ])

    expect(endTypeItemsSurvey).toEqual([
      { text: 'when user completes the survey', value: 'TrainingCompleted' },
      { text: 'after occurences', value: 'AfterOccurrences' },
      { text: 'on date', value: 'OnDate' }
    ])
  })

  it('contains complete day-of-week mapping from Sunday to Saturday', () => {
    expect(enrollmentAutoEnrollDayOfWeekItems.map((x) => x.value)).toEqual([0, 1, 2, 3, 4, 5, 6])
    expect(enrollmentAutoEnrollDayOfWeekItems.map((x) => x.text)).toEqual([
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ])
  })

  it('keeps certificate labels aligned between enrollment and award settings', () => {
    expect(certificateTypeItems[0].value).toBe(awardCertificateTypes[0].value)
    expect(certificateTypeItems[1].value).toBe(awardCertificateTypes[1].value)
    expect(awardCertificateTypes[0].text).toContain('first attempt')
    expect(awardCertificateTypes[1].text).toContain('any attempt')
  })
})
