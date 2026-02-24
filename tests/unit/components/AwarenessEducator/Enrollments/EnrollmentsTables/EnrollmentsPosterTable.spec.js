jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    searchEnrollments: jest.fn(() => Promise.resolve({ data: { data: {} } })),
    exportEnrollments: jest.fn(() => Promise.resolve({ data: Buffer.from('x') }))
  }
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDefaultAxiosPayload: jest.fn(() => ({
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'name',
      ascending: true,
      filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] },
      enrollmentType: 3
    }))
  }
})

import EnrollmentsPosterTable from '@/components/AwarenessEducator/Enrollments/EnrollmentsTables/EnrollmentsPosterTable.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('EnrollmentsPosterTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('data config differs for trash and non-trash row actions', () => {
    const baseGetters = {
      'permissions/getExportEnrollmentPermission': true,
      'permissions/getEnrollmentEditPermission': true,
      'permissions/getDeleteEnrollmentPermission': true
    }
    const nonTrash = EnrollmentsPosterTable.data.call({
      showDownloadButton: true,
      isTrash: false,
      $store: { getters: baseGetters }
    })
    expect(nonTrash.tableOptions.downloadButton.show).toBe(true)
    expect(nonTrash.tableOptions.rowActions).toHaveLength(5)

    const trash = EnrollmentsPosterTable.data.call({
      showDownloadButton: false,
      isTrash: true,
      $store: { getters: baseGetters }
    })
    expect(trash.tableOptions.downloadButton.show).toBe(false)
    expect(trash.tableOptions.rowActions.length).toBeGreaterThan(0)
  })

  it('computed keys and preferred languages return expected values', () => {
    const ctx = {
      isTrash: false,
      $store: { getters: { 'trainingLibraryHelpers/getPreferredLanguageTypes': [{ code: 'EN' }] } }
    }
    expect(EnrollmentsPosterTable.computed.getPreferredLanguageTypes.call(ctx)).toEqual([
      { code: 'EN' }
    ])
    expect(EnrollmentsPosterTable.computed.savedFiltersKey.call(ctx)).toBe('EnrollmentsPosterList')
    expect(EnrollmentsPosterTable.computed.savedTableSettingsKey.call(ctx)).toBe(
      'EnrollmentsPosterListSettings'
    )

    const trashCtx = {
      isTrash: true,
      $store: { getters: {} }
    }
    expect(EnrollmentsPosterTable.computed.getPreferredLanguageTypes.call(trashCtx)).toEqual([])
    expect(EnrollmentsPosterTable.computed.savedFiltersKey.call(trashCtx)).toContain(
      'TrashPosterList'
    )
    expect(EnrollmentsPosterTable.computed.savedTableSettingsKey.call(trashCtx)).toContain(
      'TrashPosterList'
    )
  })

  it('callForData maps language names, roles and paging values', async () => {
    const apiFunc = jest.fn(() =>
      Promise.resolve({
        data: {
          data: {
            results: [
              {
                enrollmentId: 'e1',
                languages: ['EN', 'TR', 'XX'],
                trainingRoles: [{ roleName: 'Admin' }, { roleName: 'User' }]
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
      setLoading: jest.fn(),
      apiFunc,
      axiosPayload: { filter: {}, enrollmentType: 3 },
      languages: [
        { code: 'EN', isoFriendlyName: 'English' },
        { code: 'TR', isoFriendlyName: 'Turkish' }
      ],
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 0 },
      tableData: []
    }

    EnrollmentsPosterTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(apiFunc).toHaveBeenCalledWith(ctx.axiosPayload)
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.tableData[0].languageCodes).toEqual(['EN', 'TR', 'XX'])
    expect(ctx.tableData[0].languages).toEqual(['English', 'Turkish', 'XX'])
    expect(ctx.tableData[0].targetAudience).toEqual(['Admin', 'User'])
  })

  it('callForData handles empty api payload safely', async () => {
    const apiFunc = jest.fn(() => Promise.resolve({ data: { data: {} } }))
    const ctx = {
      setLoading: jest.fn(),
      apiFunc,
      axiosPayload: {},
      languages: [],
      serverSideProps: {},
      tableData: [{ enrollmentId: 'old' }]
    }

    EnrollmentsPosterTable.methods.callForData.call(ctx)
    await flushPromises()
    expect(ctx.tableData).toEqual([])
  })

  it('exportEnrollments maps export type and triggers file download', async () => {
    const oldCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:poster')
    const links = []
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { href: '', download: '', click: jest.fn() }
      links.push(link)
      return link
    })
    const ctx = {
      axiosPayload: {
        orderBy: 'name',
        ascending: true,
        filter: { FilterGroups: [] },
        enrollmentType: 3
      }
    }

    EnrollmentsPosterTable.methods.exportEnrollments.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      pageNumber: 2,
      pageSize: 50,
      reportAllPages: false
    })
    await flushPromises()

    expect(AwarenessEducatorService.exportEnrollments).toHaveBeenCalledTimes(2)
    expect(AwarenessEducatorService.exportEnrollments.mock.calls[0][0]).toEqual(
      expect.objectContaining({ exportType: 'Excel', enrollmentType: 3 })
    )
    expect(links[0].download).toBe('Poster-List.xlsx')
    expect(links[1].download).toBe('Poster-List.csv')

    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = oldCreateObjectURL
  })
})
