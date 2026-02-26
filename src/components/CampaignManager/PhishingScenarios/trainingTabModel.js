const DEFAULT_ENROLLMENT_REMINDER = {
  periodCount: 1,
  periodType: 'Day',
  endType: 'TrainingCompleted',
  occurrenceCount: 1,
  stopTime: '',
  sendReminderEvery: false
}

const DEFAULT_TRAINING_REDIRECT_PAGE = {
  informationMessage:
    'Because you failed the phishing simulation test, you have been assigned to a training selected by the company admin',
  redirectMessage: 'Please start the training and complete the training as soon as possible',
  startButtonLabel: 'Start Training'
}

const DEFAULT_QUISHING_REDIRECT_PAGE = {
  informationMessage:
    'Because you failed the quishing simulation test, you have been assigned to a training selected by the company admin',
  redirectMessage: 'Please start the training and complete the training as soon as possible',
  startButtonLabel: 'Start Training'
}

export default class TrainingTabModel {
  constructor(
    trainingId = '',
    trainingName = '',
    trainingLanguageIds = [],
    isCheckboxSelected = false,
    enrollmentSendTypeId = '1',
    awardCertificate = false,
    certificateConfigSendType = 'SendOnFirstAttempt',
    enrollmentReminder = null,
    trainingRedirectPage = null
  ) {
    this.trainingId = trainingId
    this.trainingName = trainingName
    this.trainingLanguageIds = trainingLanguageIds
    this.isCheckboxSelected = isCheckboxSelected
    this.enrollmentSendTypeId = enrollmentSendTypeId
    this.awardCertificate = awardCertificate
    this.certificateConfigSendType = certificateConfigSendType
    this.enrollmentReminder = enrollmentReminder ?? structuredClone(DEFAULT_ENROLLMENT_REMINDER)
    this.trainingRedirectPage = trainingRedirectPage ?? structuredClone(DEFAULT_TRAINING_REDIRECT_PAGE)
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
    enrollmentReminder = null,
    trainingRedirectPage = null
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
      trainingRedirectPage ?? structuredClone(DEFAULT_QUISHING_REDIRECT_PAGE)
    )
  }
}
