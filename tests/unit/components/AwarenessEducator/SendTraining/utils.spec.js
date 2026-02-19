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
})
