export default class TrainingTabModel {
  constructor(
    trainingResourceId = '',
    trainingName = '',
    trainingLanguages = [],
    isCheckboxSelected = false
  ) {
    this.trainingResourceId = trainingResourceId
    this.trainingName = trainingName
    this.trainingLanguages = trainingLanguages
    this.isCheckboxSelected = isCheckboxSelected
  }
}
