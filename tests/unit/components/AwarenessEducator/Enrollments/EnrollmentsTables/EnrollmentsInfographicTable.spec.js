jest.mock('@/api/awarenessEducator', () => ({
  exportEnrollments: jest.fn(() => Promise.resolve({ data: new Uint8Array([1]) })),
  searchEnrollments: jest.fn()
}))

import EnrollmentsInfographicTable from '@/components/AwarenessEducator/Enrollments/EnrollmentsTables/EnrollmentsInfographicTable.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { trashRowActions } from '@/components/AwarenessEducator/Enrollments/EnrollmentsTables/utils'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('EnrollmentsInfographicTable.vue methods/computed', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed keys switch between trash and standard modes', () => {
    expect(EnrollmentsInfographicTable.computed.savedFiltersKey.call({ isTrash: true })).toBe(
      DEFAULT_SEARCH_CONTAINER_KEYS.TRASH_INFOGRAPHIC_LIST
    )
    expect(
      EnrollmentsInfographicTable.computed.savedTableSettingsKey.call({ isTrash: true })
    ).toBe(TABLE_SETTINGS_KEYS.TRASH_INFOGRAPHIC_LIST)

    expect(EnrollmentsInfographicTable.computed.savedFiltersKey.call({ isTrash: false })).toBe(
      DEFAULT_SEARCH_CONTAINER_KEYS.ENROLLMENTS_INFOGRAPHIC_LIST
    )
    expect(
      EnrollmentsInfographicTable.computed.savedTableSettingsKey.call({ isTrash: false })
    ).toBe(TABLE_SETTINGS_KEYS.ENROLLMENTS_INFOGRAPHIC_LIST)
  })

  it('callForData maps language names and target audiences', async () => {
    const apiFunc = jest.fn(() =>
      Promise.resolve({
        data: {
          data: {
            results: [
              {
                enrollmentId: 'i1',
                languages: ['de'],
                trainingRoles: [{ roleName: 'Member' }]
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
      axiosPayload: { filter: {}, enrollmentType: 4 },
      languages: [{ code: 'de', isoFriendlyName: 'German' }],
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }

    EnrollmentsInfographicTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData[0].languages).toEqual(['German'])
    expect(ctx.tableData[0].targetAudience).toEqual(['Member'])
  })

  it('callForData handles missing language/training data with safe fallbacks', async () => {
    const apiFunc = jest.fn(() =>
      Promise.resolve({
        data: {
          data: {
            results: [{ enrollmentId: 'i2' }],
            totalNumberOfRecords: 0,
            totalNumberOfPages: 0,
            pageNumber: 1
          }
        }
      })
    )
    const ctx = {
      apiFunc,
      axiosPayload: { filter: {}, enrollmentType: 4 },
      languages: undefined,
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }

    EnrollmentsInfographicTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData[0].languages).toBeUndefined()
    expect(ctx.tableData[0].targetAudience).toEqual([])
  })

  it('exportEnrollments maps XLS to Excel and uses Infographic file name', async () => {
    const links = []
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { click: jest.fn(), href: '', download: '' }
      links.push(link)
      return link
    })
    if (!globalThis.URL.createObjectURL) {
      globalThis.URL.createObjectURL = jest.fn()
    }
    const objectUrlSpy = jest.spyOn(globalThis.URL, 'createObjectURL').mockReturnValue('blob:inf')
    const ctx = {
      axiosPayload: { orderBy: 'name', ascending: true, filter: {}, enrollmentType: 4 }
    }

    EnrollmentsInfographicTable.methods.exportEnrollments.call(ctx, {
      exportTypes: ['XLS'],
      pageNumber: 2,
      pageSize: 10,
      reportAllPages: true
    })
    await flushPromises()

    expect(AwarenessEducatorService.exportEnrollments).toHaveBeenCalledWith(
      expect.objectContaining({
        exportType: 'Excel',
        pageNumber: 2,
        pageSize: 10,
        reportAllPages: true
      })
    )
    expect(links[0].download).toBe('Infographic-List.xlsx')

    createElementSpy.mockRestore()
    objectUrlSpy.mockRestore()
  })

  it('mounted hook triggers callForData', () => {
    const callForData = jest.fn()
    EnrollmentsInfographicTable.mounted.call({ callForData })
    expect(callForData).toHaveBeenCalled()
  })

  it('getPreferredLanguageTypes returns store values and fallback empty array', () => {
    const withValue = {
      $store: {
        getters: { 'trainingLibraryHelpers/getPreferredLanguageTypes': [{ code: 'en' }] }
      }
    }
    expect(EnrollmentsInfographicTable.computed.getPreferredLanguageTypes.call(withValue)).toEqual([
      { code: 'en' }
    ])

    const fallback = { $store: { getters: {} } }
    expect(EnrollmentsInfographicTable.computed.getPreferredLanguageTypes.call(fallback)).toEqual([])
  })

  it('data builds trash and non-trash row actions depending on mode', () => {
    const trashData = EnrollmentsInfographicTable.data.call({
      isTrash: true,
      showDownloadButton: true,
      $store: {
        getters: {
          'permissions/getExportEnrollmentPermission': false,
          'permissions/getEnrollmentEditPermission': false,
          'permissions/getDeleteEnrollmentPermission': false
        }
      }
    })
    expect(trashData.tableOptions.rowActions).toEqual(trashRowActions)
    expect(trashData.tableOptions.downloadButton.disabled).toBe(true)

    const normalData = EnrollmentsInfographicTable.data.call({
      isTrash: false,
      showDownloadButton: true,
      $store: {
        getters: {
          'permissions/getExportEnrollmentPermission': true,
          'permissions/getEnrollmentEditPermission': true,
          'permissions/getDeleteEnrollmentPermission': true
        }
      }
    })
    expect(normalData.tableOptions.rowActions.some((r) => r.id.includes('btn-send'))).toBe(true)
    expect(normalData.tableOptions.downloadButton.disabled).toBe(false)
  })

  it('exportEnrollments writes csv filename suffix when csv is requested', async () => {
    const links = []
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { click: jest.fn(), href: '', download: '' }
      links.push(link)
      return link
    })
    if (!globalThis.URL.createObjectURL) {
      globalThis.URL.createObjectURL = jest.fn()
    }
    const objectUrlSpy = jest.spyOn(globalThis.URL, 'createObjectURL').mockReturnValue('blob:csv')
    const ctx = {
      axiosPayload: { orderBy: 'name', ascending: true, filter: {}, enrollmentType: 4 }
    }

    EnrollmentsInfographicTable.methods.exportEnrollments.call(ctx, {
      exportTypes: ['CSV'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()

    expect(links[0].download).toBe('Infographic-List.csv')

    createElementSpy.mockRestore()
    objectUrlSpy.mockRestore()
  })
})
