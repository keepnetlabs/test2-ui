import TrainingLibraryCommonComponents from '@/components/TrainingLibrary/TrainingLibraryCommonComponents.vue'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'

describe('TrainingLibraryCommonComponents.vue', () => {
  it('data returns TRAINING_LIBRARY_TYPES', () => {
    expect(TrainingLibraryCommonComponents.data().TRAINING_LIBRARY_TYPES).toEqual(
      TRAINING_LIBRARY_TYPES
    )
  })

  it('currentDrawer returns training when getTrainingPreviewDialog active', () => {
    const ctx = {
      getTrainingPreviewDialog: { status: true, type: 'Training', selectedRow: {} },
      getPosterPreviewDialog: { status: false },
      getInfographicPreviewDialog: { status: false },
      getScreensaverPreviewDialog: { status: false },
      getSurveyPreviewDialog: { status: false },
      getLearningPathPreviewDialog: { status: false }
    }
    const result = TrainingLibraryCommonComponents.computed.currentDrawer.call(ctx)
    expect(result.dialogType).toBe('training')
    expect(result.status).toBe(true)
  })

  it('currentDrawer returns default when no dialog active', () => {
    const ctx = {
      getTrainingPreviewDialog: { status: false },
      getPosterPreviewDialog: { status: false },
      getInfographicPreviewDialog: { status: false },
      getScreensaverPreviewDialog: { status: false },
      getSurveyPreviewDialog: { status: false },
      getLearningPathPreviewDialog: { status: false }
    }
    const result = TrainingLibraryCommonComponents.computed.currentDrawer.call(ctx)
    expect(result.status).toBe(false)
    expect(result.dialogType).toBeNull()
  })
})
