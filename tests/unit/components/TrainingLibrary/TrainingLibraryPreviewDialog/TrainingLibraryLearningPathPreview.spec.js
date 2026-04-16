import TrainingLibraryLearningPathPreview from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibraryLearningPathPreview.vue'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

jest.mock('@/api/awarenessEducator', () => ({
  getTraining: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          name: 'Poster Step',
          hasQuiz: false,
          trainingCategories: [
            { code: 'RemoteWorkingSecurity', categoryName: 'Remote Working Security' },
            { code: 'TravelSecurity', categoryName: 'Travel Security' }
          ]
        }
      }
    })
  )
}))

describe('TrainingLibraryLearningPathPreview.vue', () => {
  it('getActiveMaterialNameLabel returns survey label when isSurvey', () => {
    const label = TrainingLibraryLearningPathPreview.computed.getActiveMaterialNameLabel.call({
      isSurvey: true,
      activeTrainingContentType: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING
    })
    expect(typeof label).toBe('string')
    expect(label.toLowerCase()).toContain('survey')
  })

  it('handleChangeTab sets active content and calls detail loader on step tab', () => {
    const callForActiveTrainingDetail = jest.fn()
    const ctx = {
      getTrainingGroups: [{ detailTrainingId: 't1', type: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER, languages: ['en'] }],
      callForActiveTrainingDetail
    }
    TrainingLibraryLearningPathPreview.methods.handleChangeTab.call(ctx, {
      label: 'Step 1: X',
      index: '1'
    })
    expect(ctx.activeTrainingContentId).toBe('t1')
    expect(callForActiveTrainingDetail).toHaveBeenCalled()
  })

  it('callForActiveTrainingDetail normalizes multi category display', async () => {
    const ctx = {
      isTemplateLoading: true,
      activeTrainingContentId: 'step-1',
      activeTrainingContentLanguageCodes: [],
      activeTrainingContentParams: null,
      isSurvey: false,
      activeTrainingContentButtonKey: '',
      activeTrainingContentLanguages: [],
      activeTrainingLanguageId: '',
      callForTemplatePreview: jest.fn(),
      languages: []
    }

    TrainingLibraryLearningPathPreview.methods.callForActiveTrainingDetail.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.activeTrainingContentParams).toEqual(
      expect.objectContaining({
        categoryName: 'Remote Working Security, Travel Security'
      })
    )
  })
})

