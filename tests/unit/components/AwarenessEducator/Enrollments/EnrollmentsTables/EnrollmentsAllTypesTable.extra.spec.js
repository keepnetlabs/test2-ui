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

  it('callForData maps language labels with isoFriendlyName fallback and keeps unknown code', async () => {
    const apiFunc = jest.fn(() =>
      Promise.resolve({
        data: {
          data: {
            results: [
              {
                enrollmentId: 'e2',
                languages: ['en', 'xx'],
                trainingRoles: [{ roleName: 'Admins' }]
              }
            ],
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
      languages: [{ code: 'en', isoFriendlyName: 'English' }],
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }

    EnrollmentsAllTypesTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData[0].languages).toEqual(['English', 'xx'])
    expect(ctx.tableData[0].targetAudience).toEqual(['Admins'])
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

  it('exportEnrollments maps XLS to Excel and uses xlsx suffix', async () => {
    if (!globalThis.URL) globalThis.URL = {}
    if (!globalThis.URL.createObjectURL) globalThis.URL.createObjectURL = jest.fn()
    const links = []
    jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { click: jest.fn(), href: '', download: '' }
      links.push(link)
      return link
    })
    jest.spyOn(globalThis.URL, 'createObjectURL').mockReturnValue('blob:xls')
    const AwarenessEducatorService = require('@/api/awarenessEducator').default

    const ctx = {
      axiosPayload: { orderBy: 'name', ascending: true, filter: {}, enrollmentType: null }
    }

    EnrollmentsAllTypesTable.methods.exportEnrollments.call(ctx, {
      exportTypes: ['XLS'],
      pageNumber: 2,
      pageSize: 25,
      reportAllPages: true
    })
    await flushPromises()

    expect(AwarenessEducatorService.exportEnrollments).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'Excel', pageNumber: 2, pageSize: 25 })
    )
    expect(links[0].download).toBe('All-Types-List.xlsx')
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

  it('types watcher returns early when incoming list is empty', () => {
    const vm = {
      tableOptions: { columns: [{ property: 'type' }] },
      $refs: { refTable: { reRenderFilters: jest.fn() } },
      $set: jest.fn()
    }

    EnrollmentsAllTypesTable.watch.types.handler.call(vm, [])

    expect(vm.$set).not.toHaveBeenCalled()
    expect(vm.$refs.refTable.reRenderFilters).not.toHaveBeenCalled()
  })

  it('types watcher keeps empty filtered list when only SCREENSAVER is provided', () => {
    const typeCol = { property: 'type' }
    const vm = {
      tableOptions: { columns: [typeCol] },
      $refs: { refTable: { reRenderFilters: jest.fn() } },
      $set: jest.fn()
    }

    EnrollmentsAllTypesTable.watch.types.handler.call(vm, [
      { text: TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER }
    ])

    expect(vm.$set).toHaveBeenCalledWith(typeCol, 'filterableItems', [])
    expect(vm.$refs.refTable.reRenderFilters).toHaveBeenCalledTimes(1)
  })

  it('exportEnrollments sends payload fields for each export type', async () => {
    const AwarenessEducatorService = require('@/api/awarenessEducator').default
    AwarenessEducatorService.exportEnrollments.mockResolvedValue({ data: Buffer.from('x') })

    if (!globalThis.URL) globalThis.URL = {}
    if (!globalThis.URL.createObjectURL) globalThis.URL.createObjectURL = jest.fn()
    const createObjectURLSpy = jest.spyOn(globalThis.URL, 'createObjectURL').mockReturnValue('blob:file')
    const createObjectURLCountBefore = createObjectURLSpy.mock.calls.length
    const links = []
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { click: jest.fn(), href: '', download: '' }
      links.push(link)
      return link
    })

    const ctx = {
      axiosPayload: {
        orderBy: 'createdAt',
        ascending: false,
        filter: { FilterGroups: [{ FilterItems: [] }] },
        enrollmentType: 'Poster'
      }
    }

    EnrollmentsAllTypesTable.methods.exportEnrollments.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      pageNumber: 3,
      pageSize: 50,
      reportAllPages: true
    })
    await flushPromises()
    await flushPromises()

    expect(AwarenessEducatorService.exportEnrollments).toHaveBeenCalledWith(
      expect.objectContaining({
        pageNumber: 3,
        pageSize: 50,
        orderBy: 'createdAt',
        ascending: false,
        reportAllPages: true,
        exportType: 'Excel',
        enrollmentType: 'Poster'
      })
    )
    expect(AwarenessEducatorService.exportEnrollments).toHaveBeenCalledWith(
      expect.objectContaining({
        exportType: 'CSV'
      })
    )
    expect(createObjectURLSpy.mock.calls.length - createObjectURLCountBefore).toBe(2)
    expect(links[0].download).toBe('All-Types-List.xlsx')
    expect(links[1].download).toBe('All-Types-List.csv')

    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
  })

  it('data() disables download button when export permission is missing', () => {
    const data = EnrollmentsAllTypesTable.data.call({
      isTrash: false,
      showDownloadButton: true,
      $store: {
        getters: {
          'permissions/getExportEnrollmentPermission': false,
          'permissions/getEnrollmentEditPermission': true,
          'permissions/getDeleteEnrollmentPermission': true
        }
      }
    })

    expect(data.tableOptions.downloadButton.show).toBe(true)
    expect(data.tableOptions.downloadButton.disabled).toBe(true)
  })

  it('data() hides download button when showDownloadButton is false', () => {
    const data = EnrollmentsAllTypesTable.data.call({
      isTrash: false,
      showDownloadButton: false,
      $store: {
        getters: {
          'permissions/getExportEnrollmentPermission': true,
          'permissions/getEnrollmentEditPermission': true,
          'permissions/getDeleteEnrollmentPermission': true
        }
      }
    })

    expect(data.tableOptions.downloadButton.show).toBe(false)
    expect(data.tableOptions.downloadButton.disabled).toBe(false)
  })
})
