export default class TrainingTabModel {
  constructor(
    trainingId = '',
    trainingName = '',
    trainingLanguageIds = [],
    isCheckboxSelected = false
  ) {
    this.trainingId = trainingId
    this.trainingName = trainingName
    this.trainingLanguageIds = trainingLanguageIds
    this.isCheckboxSelected = isCheckboxSelected
  }
}
