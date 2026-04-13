import TrainingLibrarySurveyTable from '@/components/TrainingLibrary/TrainingLibraryTables/TrainingLibrarySurveyTable.vue'
import labels from '@/model/constants/labels'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'
import { TRAINING_LIBRARY_MAIN_TABS } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

describe('TrainingLibrarySurveyTable.vue (extra)', () => {
  it('selectedTrainingContent watcher uses favourite state and root-aware survey CTA', () => {
    const baseCtx = {
      tableOptions: {
        iEmpty: { message: labels.EmptySurvey, btn: null }
      },
      $set: (obj, key, value) => {
        obj[key] = value
      }
    }

    TrainingLibrarySurveyTable.watch.selectedTrainingContent.handler.call(
      baseCtx,
      TRAINING_LIBRARY_MAIN_TABS.FAVOURITES
    )
    expect(baseCtx.tableOptions.iEmpty.message).toBe(labels.EmptyTrainingFavorites)
    expect(baseCtx.tableOptions.iEmpty.btn).toBeNull()

    const rootCtx = { ...baseCtx, isRootUser: true }
    TrainingLibrarySurveyTable.watch.selectedTrainingContent.handler.call(
      rootCtx,
      TRAINING_LIBRARY_MAIN_TABS.ALL_MATERIALS
    )
    expect(rootCtx.tableOptions.iEmpty.message).toBe(labels.EmptySurvey)
    expect(rootCtx.tableOptions.iEmpty.btn).toBe(labels.CreateNewSurvey)

    const nonRootCtx = {
      ...baseCtx,
      tableOptions: { iEmpty: { message: '', btn: 'stale' } },
      isRootUser: false
    }
    TrainingLibrarySurveyTable.watch.selectedTrainingContent.handler.call(
      nonRootCtx,
      TRAINING_LIBRARY_MAIN_TABS.ALL_MATERIALS
    )
    expect(nonRootCtx.tableOptions.iEmpty.btn).toBeNull()
  })

  it('renderedColumns watcher keeps training name visible', () => {
    const ctx = {
      tableOptions: {
        columns: [
          { property: PROPERTY_STORE.TRAINING_NAME, show: false },
          { property: PROPERTY_STORE.LANGUAGE, show: false }
        ]
      }
    }

    TrainingLibrarySurveyTable.watch.renderedColumns.handler.call(ctx, [PROPERTY_STORE.LANGUAGE])

    expect(ctx.tableOptions.columns[0].show).toBe(true)
    expect(ctx.tableOptions.columns[1].show).toBe(true)
  })

  it('mounted enables survey CTA for root users and syncs table sort refs', () => {
    const sort = jest.fn()
    const ctx = {
      isRootUser: true,
      firstColFixed: 'left',
      lastColFixed: 'right',
      tableOptions: { iEmpty: { btn: null } },
      axiosPayload: { orderBy: 'name', sortOrder: true },
      $refs: {
        refTable: {
          firstColFixed: false,
          lastColFixed: false,
          $refs: { elTableRef: { sort } }
        }
      }
    }

    TrainingLibrarySurveyTable.mounted.call(ctx)

    expect(ctx.tableOptions.iEmpty.btn).toBe(labels.CreateNewSurvey)
    expect(ctx.$refs.refTable.firstColFixed).toBe('left')
    expect(ctx.$refs.refTable.lastColFixed).toBe('right')
    expect(sort).toHaveBeenCalledWith('name', 'ascending')
  })

  it('serverSideSizeChanged resets page numbers and refetches data', () => {
    const callForData = jest.fn()
    const ctx = {
      axiosPayload: { pageSize: 5, pageNumber: 7 },
      serverSideProps: { pageSize: 5, pageNumber: 7 },
      callForData
    }

    TrainingLibrarySurveyTable.methods.serverSideSizeChanged.call(ctx, 15)

    expect(ctx.axiosPayload.pageSize).toBe(15)
    expect(ctx.serverSideProps.pageSize).toBe(15)
    expect(ctx.axiosPayload.pageNumber).toBe(1)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
    expect(callForData).toHaveBeenCalled()
  })
})
