import TrainingLibraryLearningPathTable from '@/components/TrainingLibrary/TrainingLibraryTables/TrainingLibraryLearningPathTable.vue'
import labels from '@/model/constants/labels'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'
import { TRAINING_LIBRARY_MAIN_TABS } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

describe('TrainingLibraryLearningPathTable.vue (extra)', () => {
  it('selectedTrainingContent watcher swaps empty state between favourites and default', () => {
    const ctx = {
      tableOptions: {
        iEmpty: { message: labels.EmptyLearningPath, btn: labels.CreateNewLearningPath }
      },
      $set: (obj, key, value) => {
        obj[key] = value
      }
    }

    TrainingLibraryLearningPathTable.watch.selectedTrainingContent.handler.call(
      ctx,
      TRAINING_LIBRARY_MAIN_TABS.FAVOURITES
    )
    expect(ctx.tableOptions.iEmpty.message).toBe(labels.EmptyTrainingFavorites)
    expect(ctx.tableOptions.iEmpty.btn).toBeNull()

    TrainingLibraryLearningPathTable.watch.selectedTrainingContent.handler.call(
      ctx,
      TRAINING_LIBRARY_MAIN_TABS.ALL_MATERIALS
    )
    expect(ctx.tableOptions.iEmpty.message).toBe(labels.EmptyLearningPath)
    expect(ctx.tableOptions.iEmpty.btn).toBe(labels.CreateNewLearningPath)
  })

  it('renderedColumns watcher keeps learning path name visible', () => {
    const ctx = {
      tableOptions: {
        columns: [
          { property: PROPERTY_STORE.LEARNING_PATH_NAME, show: false },
          { property: PROPERTY_STORE.CATEGORY, show: false }
        ]
      }
    }

    TrainingLibraryLearningPathTable.watch.renderedColumns.handler.call(ctx, [PROPERTY_STORE.CATEGORY])

    expect(ctx.tableOptions.columns[0].show).toBe(true)
    expect(ctx.tableOptions.columns[1].show).toBe(true)
  })

  it('fixed-column watchers sync both column metadata and table refs', () => {
    const ctx = {
      firstColFixed: 'left',
      lastColFixed: 'right',
      tableOptions: {
        columns: [{ fixed: false }, { fixed: false }]
      },
      $refs: {
        refTable: {
          firstColFixed: false,
          lastColFixed: false
        }
      }
    }

    TrainingLibraryLearningPathTable.watch.firstColFixed.call(ctx)
    TrainingLibraryLearningPathTable.watch.lastColFixed.call(ctx)

    expect(ctx.tableOptions.columns[0].fixed).toBe('left')
    expect(ctx.tableOptions.columns[1].fixed).toBe('right')
    expect(ctx.$refs.refTable.firstColFixed).toBe('left')
    expect(ctx.$refs.refTable.lastColFixed).toBe('right')
  })

  it('serverSideSizeChanged resets page numbers and refetches data', () => {
    const callForData = jest.fn()
    const ctx = {
      axiosPayload: { pageSize: 5, pageNumber: 3 },
      serverSideProps: { pageSize: 5, pageNumber: 3 },
      callForData
    }

    TrainingLibraryLearningPathTable.methods.serverSideSizeChanged.call(ctx, 20)

    expect(ctx.axiosPayload.pageSize).toBe(20)
    expect(ctx.serverSideProps.pageSize).toBe(20)
    expect(ctx.axiosPayload.pageNumber).toBe(1)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
    expect(callForData).toHaveBeenCalled()
  })
})
