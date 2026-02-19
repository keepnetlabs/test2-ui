import TrainingReportSummaryCards from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummaryCards.vue'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'

describe('TrainingReportSummaryCards.vue (extra)', () => {
  const { computed } = TrainingReportSummaryCards

  it('covers type flags and fallback-safe item extractors', () => {
    const items = {
      openedEmail: { userCount: 10 },
      inProgress: { userCount: 3 },
      completedTraining: { userCount: 7 },
      noResponse: { userCount: 2 }
    }

    expect(
      computed.isTrainingTypePosterOrInfographic.call({
        trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER
      })
    ).toBe(true)
    expect(
      computed.isTrainingTypePosterOrInfographic.call({
        trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC
      })
    ).toBe(true)
    expect(
      computed.isTrainingTypePosterOrInfographic.call({ trainingType: 'other' })
    ).toBe(false)

    expect(
      computed.isTrainingTypeLearningPath.call({
        trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH
      })
    ).toBe(true)
    expect(
      computed.isTrainingTypeLearningPath.call({
        trainingType: TRAINING_LIBRARY_TYPES.LEARNING_PATH
      })
    ).toBe(true)

    expect(
      computed.isTrainingLibraryTypeTraining.call({
        trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING
      })
    ).toBe(true)

    expect(computed.getOpenedData.call({ items })).toEqual({ userCount: 10 })
    expect(computed.getInProgressData.call({ items })).toEqual({ userCount: 3 })
    expect(computed.getCompletedTrainingData.call({ items })).toEqual({ userCount: 7 })
    expect(computed.getDownloadedData.call({ items })).toEqual({ userCount: 7 })
    expect(computed.getNoResponseData.call({ items })).toEqual({ userCount: 2 })

    expect(computed.getOpenedData.call({ items: null })).toEqual({})
    expect(computed.getNoResponseData.call({ items: undefined })).toEqual({})
  })
})
