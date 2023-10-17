export class TrainingReportDialogModel {
  constructor(phishingScenarioName = '', trainingName = '', enrollmentId = '') {
    this.phishingScenarioName = phishingScenarioName
    this.trainingName = trainingName
    this.enrollmentId = enrollmentId
  }
}
