export default class TrainingTabModel {
  constructor(
    trainingId = '',
    trainingName = '',
    trainingLanguageIds = [],
    isCheckboxSelected = false,
    enrollmentSendTypeId = '1',
    awardCertificate = false,
    certificateConfigSendType = 'SendOnFirstAttempt',
    enrollmentReminder = {
      periodCount: 1,
      periodType: 'Day',
      endType: 'TrainingCompleted',
      occurrenceCount: 1,
      stopTime: '',
      sendReminderEvery: false
    },
    trainingRedirectPage = {
      informationMessage: '',
      redirectMessage: '',
      startButtonLabel: ''
    }
  ) {
    this.trainingId = trainingId
    this.trainingName = trainingName
    this.trainingLanguageIds = trainingLanguageIds
    this.isCheckboxSelected = isCheckboxSelected
    this.enrollmentSendTypeId = enrollmentSendTypeId
    this.awardCertificate = awardCertificate
    this.certificateConfigSendType = certificateConfigSendType
    this.enrollmentReminder = enrollmentReminder
    this.trainingRedirectPage = trainingRedirectPage
  }
}
