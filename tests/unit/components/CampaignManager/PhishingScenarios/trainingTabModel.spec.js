import TrainingTabModel, {
  QuishingTrainingTabModel
} from '@/components/CampaignManager/PhishingScenarios/trainingTabModel'

describe('TrainingTabModel', () => {
  it('creates model with default values', () => {
    const model = new TrainingTabModel()

    expect(model.trainingId).toBe('')
    expect(model.trainingName).toBe('')
    expect(model.trainingLanguageIds).toEqual([])
    expect(model.enrollmentSendTypeId).toBe('1')
    expect(model.awardCertificate).toBe(false)
  })

  it('creates model with provided values', () => {
    const model = new TrainingTabModel('id1', 'Awareness', [1, 2], true)
    expect(model.trainingId).toBe('id1')
    expect(model.trainingName).toBe('Awareness')
    expect(model.trainingLanguageIds).toEqual([1, 2])
    expect(model.isCheckboxSelected).toBe(true)
  })

  it('returns default redirect page via static helper', () => {
    const page = TrainingTabModel.getTrainingRedirectPage()
    expect(page.informationMessage).toContain('phishing simulation')
    expect(page.startButtonLabel).toBe('Start Training')
  })
})

describe('QuishingTrainingTabModel', () => {
  it('inherits TrainingTabModel and keeps quishing default redirect text', () => {
    const model = new QuishingTrainingTabModel()
    expect(model).toBeInstanceOf(TrainingTabModel)
    expect(model.trainingRedirectPage.informationMessage).toContain('quishing simulation')
  })
})
