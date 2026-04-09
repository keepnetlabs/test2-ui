import TrainingLibraryInfographicTable from '@/components/TrainingLibrary/TrainingLibraryTables/TrainingLibraryInfographicTable.vue'
import labels from '@/model/constants/labels'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'
import { TRAINING_LIBRARY_MAIN_TABS } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

describe('TrainingLibraryInfographicTable.vue (extra)', () => {
  it('selectedTrainingContent watcher swaps empty state between favourites and default', () => {
    const ctx = {
      tableOptions: {
        iEmpty: { message: labels.EmptyInfographic, btn: labels.CreateNewInfographic }
      },
      $set: (obj, key, value) => {
        obj[key] = value
      }
    }

    TrainingLibraryInfographicTable.watch.selectedTrainingContent.handler.call(
      ctx,
      TRAINING_LIBRARY_MAIN_TABS.FAVOURITES
    )
    expect(ctx.tableOptions.iEmpty.message).toBe(labels.EmptyTrainingFavorites)
    expect(ctx.tableOptions.iEmpty.btn).toBeNull()

    TrainingLibraryInfographicTable.watch.selectedTrainingContent.handler.call(
      ctx,
      TRAINING_LIBRARY_MAIN_TABS.ALL_MATERIALS
    )
    expect(ctx.tableOptions.iEmpty.message).toBe(labels.EmptyInfographic)
    expect(ctx.tableOptions.iEmpty.btn).toBe(labels.CreateNewInfographic)
  })

  it('renderedColumns watcher keeps infographic name visible', () => {
    const ctx = {
      tableOptions: {
        columns: [
          { property: PROPERTY_STORE.INFOGRAPHIC_NAME, show: false },
          { property: PROPERTY_STORE.LANGUAGES, show: false }
        ]
      }
    }

    TrainingLibraryInfographicTable.watch.renderedColumns.handler.call(ctx, [PROPERTY_STORE.LANGUAGES])

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

    TrainingLibraryInfographicTable.watch.firstColFixed.call(ctx)
    TrainingLibraryInfographicTable.watch.lastColFixed.call(ctx)

    expect(ctx.tableOptions.columns[0].fixed).toBe('left')
    expect(ctx.tableOptions.columns[1].fixed).toBe('right')
    expect(ctx.$refs.refTable.firstColFixed).toBe('left')
    expect(ctx.$refs.refTable.lastColFixed).toBe('right')
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

    TrainingLibraryInfographicTable.mounted.call(ctx)

    expect(ctx.$refs.refTable.firstColFixed).toBe('left')
    expect(ctx.$refs.refTable.lastColFixed).toBe('right')
    expect(sort).toHaveBeenCalledWith('createdAt', 'descending')
  })
})
