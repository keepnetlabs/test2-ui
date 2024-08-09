export const enrollmentItems = [
  {
    title: 'Start Training Immediately',
    description: 'Target audience begins training right away after a failed phishing behavior',
    value: '1'
  },
  {
    title: 'Enroll via Email Notification',
    description: 'Target audience enrolls in training through an email notification',
    value: '2'
  },
  {
    title: 'Start Training Immediately and Enroll via Email Notification',
    description:
      'Target audience immediately starts training after a failed phishing behavior and receives enrollment details through an email notification',
    value: '3'
  }
]
export const enrollmentItemsTrainingTab = [
  {
    title: 'Start Training Immediately',
    description: 'Target audience begins training right away after a failed phishing behavior',
    value: '1'
  },
  {
    title: 'Enroll via Email Notification',
    description: 'Target audience enrolls in training through an email notification',
    value: '2'
  }
]
export const attachmentScenarioEnrollmentItems = [
  {
    title: 'Enroll via Email Notification',
    description: 'Target audience enrolls in training through an email notification',
    value: '2'
  }
]
export const certificateTypeItems = [
  { text: 'on the first attempt', value: 'SendOnFirstAttempt' },
  { text: 'on any attempt', value: 'SendOnAnyAttempt' }
]

export const getEnrollmentSendTypeIdByEnum = (enrollmentSendTypeId) => {
  switch (enrollmentSendTypeId) {
    case 'StartTrainingImmediately ':
      return '1'
    case 'EnrollViaEmailNotification':
      return '2'
    case 'StartTrainingImmediatelyAndEnrollViaEmailNotification':
      return '3'
    default:
      return '1'
  }
}
