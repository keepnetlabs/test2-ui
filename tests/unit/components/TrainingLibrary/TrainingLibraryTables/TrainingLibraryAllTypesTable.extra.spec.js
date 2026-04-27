import TrainingLibraryAllTypesTable from '@/components/TrainingLibrary/TrainingLibraryTables/TrainingLibraryAllTypesTable.vue'
import labels from '@/model/constants/labels'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'
import {
  TRAINING_LIBRARY_MAIN_TABS,
  TRAINING_LIBRARY_PAYLOAD_TYPES,
  TRAINING_LIBRARY_TYPES
} from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

describe('TrainingLibraryAllTypesTable.vue (extra)', () => {
  it('returns created-by-you empty texts and defaults for other tabs', () => {
    expect(
      TrainingLibraryAllTypesTable.computed.getEmptyTableText.call({
        selectedTrainingContent: TRAINING_LIBRARY_MAIN_TABS.CREATED_BY_YOU
      })
    ).toBe(labels.EmptyTrainingAllTypeCreatedByYou)
    expect(
      TrainingLibraryAllTypesTable.computed.getEmptyTableSubtitleText.call({
        selectedTrainingContent: TRAINING_LIBRARY_MAIN_TABS.CREATED_BY_YOU
      })
    ).toBe(labels.EmptyTrainingAllTypeCreatedByYouSubtitle)
    expect(
      TrainingLibraryAllTypesTable.computed.getEmptyTableText.call({
        selectedTrainingContent: TRAINING_LIBRARY_MAIN_TABS.MOST_POPULAR
      })
    ).toBe(labels.EmptyTrainingMaterial)
    expect(
      TrainingLibraryAllTypesTable.computed.getEmptyTableSubtitleText.call({
        selectedTrainingContent: TRAINING_LIBRARY_MAIN_TABS.MOST_POPULAR
      })
    ).toBe('')
  })

  it('selectedTrainingContent watcher toggles create button for favourites and restores default state', () => {
    const ctx = {
      tableOptions: {
        iEmpty: { btn: labels.CreateNewMaterial, subMes: 'x' }
      },
      $set: (obj, key, value) => {
        obj[key] = value
      }
    }

    TrainingLibraryAllTypesTable.watch.selectedTrainingContent.handler.call(
      ctx,
      TRAINING_LIBRARY_MAIN_TABS.FAVOURITES
    )
    expect(ctx.tableOptions.iEmpty.btn).toBeNull()

    TrainingLibraryAllTypesTable.watch.selectedTrainingContent.handler.call(
      ctx,
      TRAINING_LIBRARY_MAIN_TABS.ALL_MATERIALS
    )
    expect(ctx.tableOptions.iEmpty.btn).toBe(labels.CreateNewMaterial)
    expect(ctx.tableOptions.iEmpty.subMes).toBe('')
  })

  it('renderedColumns watcher keeps material name visible and updates other columns', () => {
    const ctx = {
      tableOptions: {
        columns: [
          { property: PROPERTY_STORE.MATERIAL_NAME, show: false },
          { property: PROPERTY_STORE.LANGUAGES, show: false }
        ]
      }
    }

    TrainingLibraryAllTypesTable.watch.renderedColumns.handler.call(ctx, [PROPERTY_STORE.LANGUAGES])

    expect(ctx.tableOptions.columns[0].show).toBe(true)
    expect(ctx.tableOptions.columns[1].show).toBe(true)
  })

  it('language/level watchers update filter items and rerender filters', () => {
    const refTable = { reRenderFilters: jest.fn() }
    const ctx = {
      tableOptions: {
        columns: [
          { property: PROPERTY_STORE.LANGUAGES, filterableItems: [] },
          { property: PROPERTY_STORE.LEVEL, filterableItems: [] }
        ]
      },
      $set: (obj, key, value) => {
        obj[key] = value
      },
      $refs: { refTable }
    }

    TrainingLibraryAllTypesTable.watch.getLanguages.call(ctx, [
      { isoFriendlyName: 'English', code: 'en' }
    ])
    TrainingLibraryAllTypesTable.watch.getLevels.call(ctx, ['L1'])

    expect(ctx.tableOptions.columns[0].filterableItems).toEqual([{ text: 'English', value: 'en' }])
    expect(ctx.tableOptions.columns[1].filterableItems).toEqual(['L1'])
    expect(refTable.reRenderFilters).toHaveBeenCalledTimes(2)
  })

  it('duration column ships with the static UI buckets baked in (no getDurations watcher)', () => {
    expect(TrainingLibraryAllTypesTable.watch.getDurations).toBeUndefined()

    const durationColumn = TrainingLibraryAllTypesTable.data().tableOptions.columns.find(
      (col) => col.property === PROPERTY_STORE.TOTAL_DURATION
    )
    expect(durationColumn).toBeDefined()
    expect(durationColumn.filterableItems.map((item) => item.value)).toEqual([
      '1-5',
      '5-15',
      '15-30',
      '30-60',
      '60-90',
      '90+'
    ])
  })

  it('serverSideSizeChanged resets paging and learning path detection handles both type formats', () => {
    const callForData = jest.fn()
    const ctx = {
      axiosPayload: { pageSize: 10, pageNumber: 4 },
      serverSideProps: { pageSize: 10, pageNumber: 4 },
      callForData
    }

    TrainingLibraryAllTypesTable.methods.serverSideSizeChanged.call(ctx, 25)

    expect(ctx.axiosPayload.pageSize).toBe(25)
    expect(ctx.serverSideProps.pageSize).toBe(25)
    expect(ctx.axiosPayload.pageNumber).toBe(1)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
    expect(callForData).toHaveBeenCalled()

    expect(
      TrainingLibraryAllTypesTable.methods.isLearningPathType.call({}, {
        type: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH
      })
    ).toBe(true)
    expect(
      TrainingLibraryAllTypesTable.methods.isLearningPathType.call({}, {
        type: TRAINING_LIBRARY_TYPES.LEARNING_PATH
      })
    ).toBe(true)
    expect(TrainingLibraryAllTypesTable.methods.isLearningPathType.call({}, { type: 'Poster' })).toBe(
      false
    )
  })
})
