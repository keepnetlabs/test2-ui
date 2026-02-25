import TrainingLibraryPosterTable from '@/components/TrainingLibrary/TrainingLibraryTables/TrainingLibraryPosterTable.vue'
import labels from '@/model/constants/labels'
import { TRAINING_LIBRARY_MAIN_TABS } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

describe('TrainingLibraryPosterTable.vue', () => {
  it('has correct component name', () => {
    expect(TrainingLibraryPosterTable.name).toBe('TrainingLibraryPosterTable')
  })

  it('handleAddPoster dispatches setNewPosterModal', () => {
    const setNewPosterModal = jest.fn()
    const ctx = { setNewPosterModal }
    TrainingLibraryPosterTable.methods.handleAddPoster.call(ctx)
    expect(setNewPosterModal).toHaveBeenCalledWith({
      status: true,
      isEdit: false,
      selectedRow: null,
      isDuplicate: false
    })
  })

  it('serverSidePageNumberChanged updates pageNumber and calls callForData', () => {
    const callForData = jest.fn()
    const ctx = {
      axiosPayload: { pageNumber: 1 },
      callForData
    }
    TrainingLibraryPosterTable.methods.serverSidePageNumberChanged.call(ctx, 3)
    expect(ctx.axiosPayload.pageNumber).toBe(3)
    expect(callForData).toHaveBeenCalled()
  })

  it('serverSideSizeChanged updates pageSize and resets to page 1', () => {
    const callForData = jest.fn()
    const ctx = {
      axiosPayload: { pageNumber: 2, pageSize: 10 },
      serverSideProps: { pageNumber: 2, pageSize: 10 },
      callForData
    }
    TrainingLibraryPosterTable.methods.serverSideSizeChanged.call(ctx, 25)
    expect(ctx.axiosPayload.pageSize).toBe(25)
    expect(ctx.serverSideProps.pageSize).toBe(25)
    expect(ctx.axiosPayload.pageNumber).toBe(1)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
    expect(callForData).toHaveBeenCalled()
  })

  it('selectedTrainingContent watcher sets empty message for FAVOURITES tab', () => {
    const ctx = {
      tableOptions: {
        iEmpty: { message: 'Empty', btn: 'Add' }
      },
      $set: jest.fn((obj, key, val) => {
        obj[key] = val
      })
    }
    TrainingLibraryPosterTable.watch.selectedTrainingContent.handler.call(
      ctx,
      TRAINING_LIBRARY_MAIN_TABS.FAVOURITES
    )
    expect(ctx.tableOptions.iEmpty.message).toBe(labels.EmptyTrainingFavorites)
    expect(ctx.tableOptions.iEmpty.btn).toBeNull()
  })

  it('selectedTrainingContent watcher sets default for non-FAVOURITES tab', () => {
    const ctx = {
      tableOptions: {
        iEmpty: { message: 'Favorites', btn: null }
      },
      $set: jest.fn((obj, key, val) => {
        obj[key] = val
      })
    }
    TrainingLibraryPosterTable.watch.selectedTrainingContent.handler.call(ctx, 'poster')
    expect(ctx.tableOptions.iEmpty.message).toBe(labels.EmptyPoster)
    expect(ctx.tableOptions.iEmpty.btn).toBe(labels.CreateNewPoster)
  })
})
