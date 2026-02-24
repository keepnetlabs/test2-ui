jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    exportEnrollments: jest.fn(() => Promise.resolve({ data: Buffer.from('x') })),
    searchEnrollments: jest.fn()
  }
}))

import EnrollmentsAllTypesTable from '@/components/AwarenessEducator/Enrollments/EnrollmentsTables/EnrollmentsAllTypesTable.vue'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('EnrollmentsAllTypesTable.vue (extra branch coverage)', () => {
  it('callForData handles null response with fallback', async () => {
    const apiFunc = jest.fn(() => Promise.resolve(null))
    const ctx = {
      apiFunc,
      axiosPayload: {},
      languages: [],
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }

    EnrollmentsAllTypesTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData).toEqual([])
  })

  it('callForData handles item.trainingRoles undefined', async () => {
    const apiFunc = jest.fn(() =>
      Promise.resolve({
        data: {
          data: {
            results: [{ enrollmentId: 'e1', languages: [] }],
            totalNumberOfRecords: 1,
            totalNumberOfPages: 1,
            pageNumber: 1
          }
        }
      })
    )
    const ctx = {
      apiFunc,
      axiosPayload: {},
      languages: [],
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }

    EnrollmentsAllTypesTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData[0].targetAudience).toEqual([])
  })

  it('exportEnrollments uses CSV when item is not XLS', async () => {
    if (!globalThis.URL) globalThis.URL = {}
    if (!globalThis.URL.createObjectURL) globalThis.URL.createObjectURL = jest.fn()
    const links = []
    jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { click: jest.fn(), href: '', download: '' }
      links.push(link)
      return link
    })
    jest.spyOn(globalThis.URL, 'createObjectURL').mockReturnValue('blob:csv')

    const ctx = {
      axiosPayload: { orderBy: 'name', ascending: true, filter: {}, enrollmentType: null }
    }

    EnrollmentsAllTypesTable.methods.exportEnrollments.call(ctx, {
      exportTypes: ['CSV'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()

    expect(links[0].download).toBe('All-Types-List.csv')
  })

  it('types watcher filters out SCREENSAVER and calls reRenderFilters', () => {
    const reRenderFilters = jest.fn()
    const typeCol = { property: 'type' }
    const vm = {
      tableOptions: { columns: [{ property: 'other' }, typeCol] },
      $refs: { refTable: { reRenderFilters } },
      $set: jest.fn()
    }
    const types = [
      { text: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING },
      { text: TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER },
      { text: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER }
    ]

    EnrollmentsAllTypesTable.watch.types.handler.call(vm, types)

    expect(vm.$set).toHaveBeenCalledWith(
      expect.objectContaining({ property: 'type' }),
      'filterableItems',
      expect.arrayContaining([expect.objectContaining({ text: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING })])
    )
    expect(reRenderFilters).toHaveBeenCalled()
  })

  it('types watcher handles optional refTable', () => {
    const vm = {
      tableOptions: { columns: [{ property: 'type' }] },
      $refs: {},
      $set: jest.fn()
    }

    expect(() => {
      EnrollmentsAllTypesTable.watch.types.handler.call(vm, [
        { text: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER }
      ])
    }).not.toThrow()
  })
})
