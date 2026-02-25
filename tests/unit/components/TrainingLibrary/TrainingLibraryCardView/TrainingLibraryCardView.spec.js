jest.mock('@/api/awarenessEducator', () => ({
  getTrainingTypeCount: jest.fn(() => Promise.resolve({ data: {} })),
  searchTraining: jest.fn(() => Promise.resolve({ data: {} }))
}))

import TrainingLibraryCardView from '@/components/TrainingLibrary/TrainingLibraryCardView/TrainingLibraryCardView.vue'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import labels from '@/model/constants/labels'

describe('TrainingLibraryCardView.vue', () => {
  it('isRenderEmpty returns true when no tableData', () => {
    expect(
      TrainingLibraryCardView.computed.isRenderEmpty.call({ tableData: [] })
    ).toBe(true)
    expect(
      TrainingLibraryCardView.computed.isRenderEmpty.call({ tableData: [{}] })
    ).toBe(false)
  })

  it('getEmptyTableTextBySelectedSubTab returns label for type', () => {
    expect(
      TrainingLibraryCardView.computed.getEmptyTableTextBySelectedSubTab.call({
        selectedSubTrainingContent: TRAINING_LIBRARY_TYPES.TRAINING
      })
    ).toBe(labels.EmptyTraining)
    expect(
      TrainingLibraryCardView.computed.getEmptyTableTextBySelectedSubTab.call({
        selectedSubTrainingContent: TRAINING_LIBRARY_TYPES.POSTER
      })
    ).toBe(labels.EmptyPoster)
  })

  it('handleServerSideCurrentChange updates pageNumber', () => {
    const callForTrainingLibrary = jest.fn()
    const ctx = {
      axiosPayload: { pageNumber: 1 },
      callForTrainingLibrary
    }
    TrainingLibraryCardView.methods.handleServerSideCurrentChange.call(ctx, 2)
    expect(ctx.axiosPayload.pageNumber).toBe(2)
    expect(callForTrainingLibrary).toHaveBeenCalled()
  })

  it('handleEmptyButtonClick calls handleAddTrainingLibraryContent', () => {
    const handleAddTrainingLibraryContent = jest.fn()
    const ctx = {
      selectedSubTrainingContent: TRAINING_LIBRARY_TYPES.TRAINING,
      handleAddTrainingLibraryContent
    }
    TrainingLibraryCardView.methods.handleEmptyButtonClick.call(ctx)
    expect(handleAddTrainingLibraryContent).toHaveBeenCalledWith(TRAINING_LIBRARY_TYPES.TRAINING)
  })
})
