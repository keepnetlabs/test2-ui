import TrainingTabModel, {
  QuishingTrainingTabModel
} from '@/components/CampaignManager/PhishingScenarios/trainingTabModel'

describe('trainingTabModel (extra branching)', () => {
  describe('TrainingTabModel constructor defaults', () => {
    it('uses cloned default enrollmentReminder when argument is null', () => {
      const model = new TrainingTabModel('', '', [], false, '1', false, 'SendOnFirstAttempt', null)
      expect(model.enrollmentReminder).toEqual(
        expect.objectContaining({
          periodType: 'Day',
          endType: 'TrainingCompleted'
        })
      )
    })

    it('uses provided enrollmentReminder when passed', () => {
      const custom = { periodCount: 9, periodType: 'Week', endType: 'Never', occurrenceCount: 0 }
      const model = new TrainingTabModel(
        '',
        '',
        [],
        false,
        '1',
        false,
        'SendOnFirstAttempt',
        custom
      )
      expect(model.enrollmentReminder).toEqual(custom)
    })

    it('uses cloned default trainingRedirectPage when argument is null', () => {
      const model = new TrainingTabModel(
        '',
        '',
        [],
        false,
        '1',
        false,
        'SendOnFirstAttempt',
        undefined,
        null
      )
      expect(model.trainingRedirectPage.informationMessage).toContain('phishing simulation')
    })

    it('uses explicit trainingRedirectPage when passed', () => {
      const page = {
        informationMessage: 'Custom info',
        redirectMessage: 'Custom redirect',
        startButtonLabel: 'Go'
      }
      const model = new TrainingTabModel(
        '',
        '',
        [],
        false,
        '1',
        false,
        'SendOnFirstAttempt',
        undefined,
        page
      )
      expect(model.trainingRedirectPage).toEqual(page)
    })
  })

  describe('QuishingTrainingTabModel', () => {
    it('uses quishing default redirect when trainingRedirectPage is omitted', () => {
      const model = new QuishingTrainingTabModel()
      expect(model.trainingRedirectPage.informationMessage).toContain('quishing simulation')
    })

    it('passes through custom trainingRedirectPage to instance', () => {
      const custom = {
        informationMessage: 'Override',
        redirectMessage: 'R',
        startButtonLabel: 'Start'
      }
      const model = new QuishingTrainingTabModel(
        'a',
        'b',
        [],
        false,
        '1',
        false,
        'SendOnFirstAttempt',
        null,
        custom
      )
      expect(model.trainingRedirectPage).toEqual(custom)
    })
  })
})
