export const periodTypeItems = [
  { text: 'days', value: 'Day' },
  { text: 'weeks', value: 'Week' },
  { text: 'months', value: 'Month' }
]
export const endTypeItems = [
  {
    text: 'when user completes the training',
    value: 'TrainingCompleted'
  },
  {
    text: 'when user completes the quiz',
    value: 'QuizCompleted'
  },
  {
    text: 'when user successfully passes the quiz',
    value: 'QuizSuccessfullyCompleted'
  },
  {
    text: 'after occurences',
    value: 'AfterOccurrences'
  },
  {
    text: 'on date',
    value: 'OnDate'
  }
]

export const enrollmentAutoEnrollTypeItems = [
  { text: 'on the same day', value: 'SameDay' },
  { text: 'on the next day', value: 'NextDay' },
  { text: 'next', value: 'Next' },
  { text: 'in', value: 'In' }
]
export const enrollmentAutoEnrollDayOfWeekItems = [
  { text: 'Sunday', value: 0 },
  { text: 'Monday', value: 1 },
  { text: 'Tuesday', value: 2 },
  { text: 'Wednesday', value: 3 },
  { text: 'Thursday', value: 4 },
  { text: 'Friday', value: 5 },
  { text: 'Saturday', value: 6 }
]
export const certificateTypeItems = [
  { text: 'on the first attempt', value: 'SendOnFirstAttempt' },
  { text: 'on any attempt', value: 'SendOnAnyAttempt' }
]
export const awardCertificateTypes = [
  { text: 'When a user completes the training on the first attempt', value: 'SendOnFirstAttempt' },
  { text: 'When a user completes the training on any attempt', value: 'SendOnAnyAttempt' }
]
