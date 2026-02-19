import { TrainingReportDialogModel } from '@/components/QuishingCampaignManagerReport/Summary/utils'

describe('QuishingCampaignManagerReport Summary utils (components path)', () => {
  it('TrainingReportDialogModel uses defaults', () => {
    const model = new TrainingReportDialogModel()
    expect(model.phishingScenarioName).toBe('')
    expect(model.trainingName).toBe('')
    expect(model.enrollmentId).toBe('')
  })

  it('returns object representation', () => {
    const model = new TrainingReportDialogModel('Scenario A', 'Training B', 'enr-1')
    expect(model.getTrainingReportDialogModel()).toEqual({
      phishingScenarioName: 'Scenario A',
      trainingName: 'Training B',
      enrollmentId: 'enr-1'
    })
  })
})
