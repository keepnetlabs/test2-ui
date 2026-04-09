import TrainingLibraryTrainingTable from '@/components/TrainingLibrary/TrainingLibraryTables/TrainingLibraryTrainingTable.vue'
import labels from '@/model/constants/labels'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'
import { TRAINING_LIBRARY_MAIN_TABS } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

describe('TrainingLibraryTrainingTable.vue (extra)', () => {
  it('selectedTrainingContent watcher swaps empty state between favourites and default', () => {
    const ctx = {
      tableOptions: {
        iEmpty: { message: labels.EmptyTraining, btn: labels.CreateNewTraining }
      },
      $set: (obj, key, value) => {
        obj[key] = value
      }
    }

    TrainingLibraryTrainingTable.watch.selectedTrainingContent.handler.call(
      ctx,
      TRAINING_LIBRARY_MAIN_TABS.FAVOURITES
    )
    expect(ctx.tableOptions.iEmpty.message).toBe(labels.EmptyTrainingFavorites)
    expect(ctx.tableOptions.iEmpty.btn).toBeNull()

    TrainingLibraryTrainingTable.watch.selectedTrainingContent.handler.call(
      ctx,
      TRAINING_LIBRARY_MAIN_TABS.ALL_MATERIALS
    )
    expect(ctx.tableOptions.iEmpty.message).toBe(labels.EmptyTraining)
    expect(ctx.tableOptions.iEmpty.btn).toBe(labels.CreateNewTraining)
  })

  it('renderedColumns watcher keeps training name visible', () => {
    const ctx = {
      tableOptions: {
        columns: [
          { property: PROPERTY_STORE.TRAINING_NAME, show: false },
          { property: PROPERTY_STORE.DURATION, show: false }
        ]
      }
    }

    TrainingLibraryTrainingTable.watch.renderedColumns.handler.call(ctx, [PROPERTY_STORE.DURATION])

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

    TrainingLibraryTrainingTable.watch.firstColFixed.call(ctx)
    TrainingLibraryTrainingTable.watch.lastColFixed.call(ctx)

    expect(ctx.tableOptions.columns[0].fixed).toBe('left')
    expect(ctx.tableOptions.columns[1].fixed).toBe('right')
    expect(ctx.$refs.refTable.firstColFixed).toBe('left')
    expect(ctx.$refs.refTable.lastColFixed).toBe('right')
  })

  it('level and duration watchers update filter items and rerender filters', () => {
    const refTable = { reRenderFilters: jest.fn() }
    const ctx = {
      tableOptions: {
        columns: [
          { property: PROPERTY_STORE.LEVEL, filterableItems: [] },
          { property: PROPERTY_STORE.DURATION, filterableItems: [] }
        ]
      },
      $set: (obj, key, value) => {
        obj[key] = value
      },
      $refs: { refTable }
    }

    TrainingLibraryTrainingTable.watch.getLevels.call(ctx, ['L1'])
    TrainingLibraryTrainingTable.watch.getDurations.call(ctx, ['15 min'])

    expect(ctx.tableOptions.columns[0].filterableItems).toEqual(['L1'])
    expect(ctx.tableOptions.columns[1].filterableItems).toEqual(['15 min'])
    expect(refTable.reRenderFilters).toHaveBeenCalledTimes(2)
  })

  it('mounted syncs fixed columns and sorts descending when sortOrder is false', () => {
    const sort = jest.fn()
    const ctx = {
      firstColFixed: 'left',
      lastColFixed: 'right',
      axiosPayload: { orderBy: 'createdAt', sortOrder: false },
      $refs: {
        refTable: {
          firstColFixed: false,
          lastColFixed: false,
          $refs: { elTableRef: { sort } }
        }
      }
    }

    TrainingLibraryTrainingTable.mounted.call(ctx)

    expect(ctx.$refs.refTable.firstColFixed).toBe('left')
    expect(ctx.$refs.refTable.lastColFixed).toBe('right')
    expect(sort).toHaveBeenCalledWith('createdAt', 'descending')
  })
})
