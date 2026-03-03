import { TrainingReportDialogModel } from '@/components/CampaignManagerReport/Summary/utils'

describe('CampaignManagerReport Summary utils', () => {
  it('creates TrainingReportDialogModel and serializes values', () => {
    const model = new TrainingReportDialogModel('Scenario 1', 'Training A', 'enroll-1')
    expect(model.getTrainingReportDialogModel()).toEqual({
      phishingScenarioName: 'Scenario 1',
      trainingName: 'Training A',
      enrollmentId: 'enroll-1'
    })
  })

  it('TrainingReportDialogModel uses default empty strings when no args', () => {
    const model = new TrainingReportDialogModel()
    expect(model.getTrainingReportDialogModel()).toEqual({
      phishingScenarioName: '',
      trainingName: '',
      enrollmentId: ''
    })
  })

  it('TrainingReportDialogModel accepts partial args', () => {
    const model = new TrainingReportDialogModel('Scenario Only')
    expect(model.getTrainingReportDialogModel()).toEqual({
      phishingScenarioName: 'Scenario Only',
      trainingName: '',
      enrollmentId: ''
    })
  })
})
