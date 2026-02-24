jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    exportEnrollments: jest.fn(() => Promise.resolve({ data: Buffer.from('x') })),
    searchEnrollments: jest.fn()
  }
}))

import EnrollmentsPosterTable from '@/components/AwarenessEducator/Enrollments/EnrollmentsTables/EnrollmentsPosterTable.vue'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('EnrollmentsPosterTable.vue (extra branch coverage)', () => {
  it('callForData handles null response with fallback', async () => {
    const apiFunc = jest.fn(() => Promise.resolve(null))
    const ctx = {
      apiFunc,
      axiosPayload: {},
      languages: [],
      serverSideProps: {},
      tableData: [{ old: true }],
      setLoading: jest.fn()
    }

    EnrollmentsPosterTable.methods.callForData.call(ctx)
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

    EnrollmentsPosterTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData[0].languages).toEqual(['XX'])
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
      axiosPayload: { orderBy: 'name', ascending: true, filter: {}, enrollmentType: 3 }
    }

    EnrollmentsPosterTable.methods.exportEnrollments.call(ctx, {
      exportTypes: ['CSV'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()

    expect(links[0].download).toBe('Poster-List.csv')
  })
})
