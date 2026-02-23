jest.mock('@/api/awarenessEducator', () => ({
  exportEnrollments: jest.fn(() => Promise.resolve({ data: new Uint8Array([1]) })),
  searchEnrollments: jest.fn()
}))

import EnrollmentsSurveyTable from '@/components/AwarenessEducator/Enrollments/EnrollmentsTables/EnrollmentsSurveyTable.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { trashRowActions } from '@/components/AwarenessEducator/Enrollments/EnrollmentsTables/utils'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('EnrollmentsSurveyTable.vue methods/computed', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('saved key computed returns trash keys when isTrash is true', () => {
    const ctx = { isTrash: true }
    expect(EnrollmentsSurveyTable.computed.savedFiltersKey.call(ctx)).toBe(
      DEFAULT_SEARCH_CONTAINER_KEYS.TRASH_SURVEY_LIST
    )
    expect(EnrollmentsSurveyTable.computed.savedTableSettingsKey.call(ctx)).toBe(
      TABLE_SETTINGS_KEYS.TRASH_SURVEY_LIST
    )
  })

  it('saved key computed returns standard keys when isTrash is false', () => {
    const ctx = { isTrash: false }
    expect(EnrollmentsSurveyTable.computed.savedFiltersKey.call(ctx)).toBe(
      DEFAULT_SEARCH_CONTAINER_KEYS.ENROLLMENTS_SURVEY_LIST
    )
    expect(EnrollmentsSurveyTable.computed.savedTableSettingsKey.call(ctx)).toBe(
      TABLE_SETTINGS_KEYS.ENROLLMENTS_SURVEY_LIST
    )
  })

  it('callForData maps languages and target audience fields', async () => {
    const apiFunc = jest.fn(() =>
      Promise.resolve({
        data: {
          data: {
            results: [
              {
                enrollmentId: 'e1',
                languages: ['en', 'tr'],
                trainingRoles: [{ roleName: 'Admin' }, { roleName: 'User' }]
              }
            ],
            totalNumberOfRecords: 5,
            totalNumberOfPages: 2,
            pageNumber: 1
          }
        }
      })
    )
    const loading = []
    const ctx = {
      apiFunc,
      axiosPayload: { filter: {}, enrollmentType: 3 },
      languages: [{ code: 'en', isoFriendlyName: 'English' }],
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn((flag = false) => loading.push(flag))
    }

    EnrollmentsSurveyTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(apiFunc).toHaveBeenCalledWith(ctx.axiosPayload)
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(5)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(2)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
    expect(ctx.tableData[0].languageCodes).toEqual(['en', 'tr'])
    expect(ctx.tableData[0].languages).toEqual(['English', 'tr'])
    expect(ctx.tableData[0].targetAudience).toEqual(['Admin', 'User'])
    expect(loading).toEqual([true, false])
  })

  it('callForData handles missing results safely', async () => {
    const apiFunc = jest.fn(() => Promise.resolve({ data: { data: {} } }))
    const ctx = {
      apiFunc,
      axiosPayload: { filter: {}, enrollmentType: 3 },
      languages: [],
      serverSideProps: {},
      tableData: [{ old: true }],
      setLoading: jest.fn()
    }

    EnrollmentsSurveyTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData).toEqual([])
  })

  it('exportEnrollments builds payload and downloads expected file names', async () => {
    const createdLinks = []
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = {
        click: jest.fn(),
        href: '',
        download: ''
      }
      createdLinks.push(link)
      return link
    })
    if (!globalThis.URL.createObjectURL) {
      globalThis.URL.createObjectURL = jest.fn()
    }
    const objectUrlSpy = jest.spyOn(globalThis.URL, 'createObjectURL').mockReturnValue('blob:survey')

    const ctx = {
      axiosPayload: { orderBy: 'name', ascending: true, filter: {}, enrollmentType: 3 }
    }

    EnrollmentsSurveyTable.methods.exportEnrollments.call(ctx, {
      exportTypes: ['XLS', 'PDF'],
      pageNumber: 1,
      pageSize: 25,
      reportAllPages: false
    })
    await flushPromises()

    expect(AwarenessEducatorService.exportEnrollments).toHaveBeenCalledTimes(2)
    expect(AwarenessEducatorService.exportEnrollments).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ exportType: 'Excel' })
    )
    expect(AwarenessEducatorService.exportEnrollments).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ exportType: 'PDF' })
    )
    expect(createdLinks[0].download).toBe('Survey-List.xlsx')
    expect(createdLinks[1].download).toBe('Survey-List.pdf')

    createElementSpy.mockRestore()
    objectUrlSpy.mockRestore()
  })

  it('mounted hook calls callForData', () => {
    const callForData = jest.fn()
    EnrollmentsSurveyTable.mounted.call({ callForData })
    expect(callForData).toHaveBeenCalled()
  })

  it('getPreferredLanguageTypes returns fallback empty array', () => {
    const ctx = { $store: { getters: {} } }
    expect(EnrollmentsSurveyTable.computed.getPreferredLanguageTypes.call(ctx)).toEqual([])
  })

  it('data uses trash row actions and permission based download disable', () => {
    const tableData = EnrollmentsSurveyTable.data.call({
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

    expect(tableData.tableOptions.rowActions).toEqual(trashRowActions)
    expect(tableData.tableOptions.downloadButton.disabled).toBe(true)
  })

  it('data builds standard row actions when not trash', () => {
    const tableData = EnrollmentsSurveyTable.data.call({
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

    expect(tableData.tableOptions.rowActions.length).toBeGreaterThan(0)
    expect(tableData.tableOptions.rowActions.some((r) => r.id.includes('btn-edit'))).toBe(true)
    expect(tableData.tableOptions.downloadButton.disabled).toBe(false)
  })

  it('callForData keeps safe defaults when languages and trainingRoles are missing', async () => {
    const apiFunc = jest.fn(() =>
      Promise.resolve({
        data: {
          data: {
            results: [{ enrollmentId: 'e2' }],
            totalNumberOfRecords: 0,
            totalNumberOfPages: 0,
            pageNumber: 1
          }
        }
      })
    )
    const ctx = {
      apiFunc,
      axiosPayload: { filter: {}, enrollmentType: 3 },
      languages: null,
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }

    EnrollmentsSurveyTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData[0].languages).toBeUndefined()
    expect(ctx.tableData[0].targetAudience).toEqual([])
  })

  it('callForData handles null response object without throwing', async () => {
    const apiFunc = jest.fn(() => Promise.resolve(null))
    const ctx = {
      apiFunc,
      axiosPayload: { filter: {}, enrollmentType: 3 },
      languages: [],
      serverSideProps: {},
      tableData: [{ keep: true }],
      setLoading: jest.fn()
    }

    EnrollmentsSurveyTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData).toEqual([])
  })

  it('getPreferredLanguageTypes returns store value when exists', () => {
    const ctx = {
      $store: {
        getters: {
          'trainingLibraryHelpers/getPreferredLanguageTypes': ['base', 'sub']
        }
      }
    }
    expect(EnrollmentsSurveyTable.computed.getPreferredLanguageTypes.call(ctx)).toEqual([
      'base',
      'sub'
    ])
  })

  it('data respects showDownloadButton=false flag', () => {
    const tableData = EnrollmentsSurveyTable.data.call({
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

    expect(tableData.tableOptions.downloadButton.show).toBe(false)
  })
})
