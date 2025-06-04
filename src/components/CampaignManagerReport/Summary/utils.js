export class TrainingReportDialogModel {
  constructor(phishingScenarioName = '', trainingName = '', enrollmentId = '') {
    this.phishingScenarioName = phishingScenarioName
    this.trainingName = trainingName
    this.enrollmentId = enrollmentId
  }
  getTrainingReportDialogModel() {
    return {
      phishingScenarioName: this.phishingScenarioName,
      trainingName: this.trainingName,
      enrollmentId: this.enrollmentId
    }
  }
}
