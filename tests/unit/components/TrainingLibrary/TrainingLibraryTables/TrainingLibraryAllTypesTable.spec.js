import TrainingLibraryAllTypesTable from '@/components/TrainingLibrary/TrainingLibraryTables/TrainingLibraryAllTypesTable.vue'
import labels from '@/model/constants/labels'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

describe('TrainingLibraryAllTypesTable.vue', () => {
  it('keeps the legacy duration property and never adopts totalDuration', () => {
    const columns = TrainingLibraryAllTypesTable.data().tableOptions.columns
    expect(
      columns.find((col) => col.property === PROPERTY_STORE.DURATION)
    ).toBeDefined()
    expect(
      columns.find((col) => col.property === PROPERTY_STORE.TOTAL_DURATION)
    ).toBeUndefined()
  })

  it('serverSidePageNumberChanged updates payload and fetches data', () => {
    const callForData = jest.fn()
    const ctx = { axiosPayload: { pageNumber: 1 }, callForData }
    TrainingLibraryAllTypesTable.methods.serverSidePageNumberChanged.call(ctx, 4)
    expect(ctx.axiosPayload.pageNumber).toBe(4)
    expect(callForData).toHaveBeenCalled()
  })

  it('getEmptyTableText returns favorites text on favorites tab', () => {
    const text = TrainingLibraryAllTypesTable.computed.getEmptyTableText.call({
      selectedTrainingContent: 'Favourites'
    })
    expect(typeof text).toBe('string')
    expect(text).toBe(labels.EmptyTrainingFavorites)
  })
})
