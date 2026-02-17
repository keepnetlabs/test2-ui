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
      informationMessage:
        'Because you failed the phishing simulation test, you have been assigned to a training selected by the company admin',
      redirectMessage: 'Please start the training and complete the training as soon as possible',
      startButtonLabel: 'Start Training'
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
  static getTrainingRedirectPage() {
    return {
      informationMessage:
        'Because you failed the phishing simulation test, you have been assigned to a training selected by the company admin',
      redirectMessage: 'Please start the training and complete the training as soon as possible',
      startButtonLabel: 'Start Training'
    }
  }
}

export class QuishingTrainingTabModel extends TrainingTabModel {
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
      informationMessage:
        'Because you failed the quishing simulation test, you have been assigned to a training selected by the company admin',
      redirectMessage: 'Please start the training and complete the training as soon as possible',
      startButtonLabel: 'Start Training'
    }
  ) {
    super(
      trainingId,
      trainingName,
      trainingLanguageIds,
      isCheckboxSelected,
      enrollmentSendTypeId,
      awardCertificate,
      certificateConfigSendType,
      enrollmentReminder,
      trainingRedirectPage
    )
  }
}
