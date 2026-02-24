jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    exportEnrollments: jest.fn(() => Promise.resolve({ data: Buffer.from('x') })),
    searchEnrollments: jest.fn()
  }
}))

import EnrollmentsTrainingTable from '@/components/AwarenessEducator/Enrollments/EnrollmentsTables/EnrollmentsTrainingTable.vue'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('EnrollmentsTrainingTable.vue (extra branch coverage)', () => {
  it('callForData handles null response with fallback', async () => {
    const apiFunc = jest.fn(() => Promise.resolve(null))
    const ctx = {
      apiFunc,
      axiosPayload: {},
      languages: [],
      serverSideProps: { totalNumberOfRecords: 9 },
      tableData: [{ old: true }],
      setLoading: jest.fn()
    }

    EnrollmentsTrainingTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData).toEqual([])
  })

  it('callForData uses code when language not found in languages list', async () => {
    const apiFunc = jest.fn(() =>
      Promise.resolve({
        data: {
          data: {
            results: [{ enrollmentId: 'e1', languages: ['XX'], trainingRoles: [] }],
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
      languages: [{ code: 'de', isoFriendlyName: 'German' }],
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }

    EnrollmentsTrainingTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData[0].languages).toEqual(['XX'])
  })

  it('callForData handles item.languages undefined', async () => {
    const apiFunc = jest.fn(() =>
      Promise.resolve({
        data: {
          data: {
            results: [{ enrollmentId: 'e1', trainingRoles: [] }],
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

    EnrollmentsTrainingTable.methods.callForData.call(ctx)
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
      axiosPayload: { orderBy: 'name', ascending: true, filter: {}, enrollmentType: 0 }
    }

    EnrollmentsTrainingTable.methods.exportEnrollments.call(ctx, {
      exportTypes: ['CSV'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()

    expect(links[0].download).toBe('Training-List.csv')
  })

  it('getPreferredLanguageTypes returns empty array when store getter is falsy', () => {
    const ctx = { $store: { getters: {} } }
    expect(EnrollmentsTrainingTable.computed.getPreferredLanguageTypes.call(ctx)).toEqual([])
  })
})
