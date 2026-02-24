jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    exportEnrollments: jest.fn(() => Promise.resolve({ data: Buffer.from('x') })),
    searchEnrollments: jest.fn()
  }
}))

import EnrollmentsTrainingTable from '@/components/AwarenessEducator/Enrollments/EnrollmentsTables/EnrollmentsTrainingTable.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { trashRowActions } from '@/components/AwarenessEducator/Enrollments/EnrollmentsTables/utils'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('EnrollmentsTrainingTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('saved key computed returns trash keys when isTrash is true', () => {
    const ctx = { isTrash: true }
    expect(EnrollmentsTrainingTable.computed.savedFiltersKey.call(ctx)).toBe(
      DEFAULT_SEARCH_CONTAINER_KEYS.TRASH_TRAINING_LIST
    )
    expect(EnrollmentsTrainingTable.computed.savedTableSettingsKey.call(ctx)).toBe(
      TABLE_SETTINGS_KEYS.TRASH_TRAINING_LIST
    )
  })

  it('saved key computed returns standard keys when isTrash is false', () => {
    const ctx = { isTrash: false }
    expect(EnrollmentsTrainingTable.computed.savedFiltersKey.call(ctx)).toBe(
      DEFAULT_SEARCH_CONTAINER_KEYS.ENROLLMENTS_TRAINING_LIST
    )
    expect(EnrollmentsTrainingTable.computed.savedTableSettingsKey.call(ctx)).toBe(
      TABLE_SETTINGS_KEYS.ENROLLMENTS_TRAINING_LIST
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
    const ctx = {
      apiFunc,
      axiosPayload: { filter: {}, enrollmentType: 0 },
      languages: [{ code: 'en', isoFriendlyName: 'English' }],
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }

    EnrollmentsTrainingTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(apiFunc).toHaveBeenCalledWith(ctx.axiosPayload)
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(5)
    expect(ctx.tableData[0].languageCodes).toEqual(['en', 'tr'])
    expect(ctx.tableData[0].languages).toEqual(['English', 'tr'])
    expect(ctx.tableData[0].targetAudience).toEqual(['Admin', 'User'])
  })

  it('callForData handles missing results safely', async () => {
    const apiFunc = jest.fn(() => Promise.resolve({ data: { data: {} } }))
    const ctx = {
      apiFunc,
      axiosPayload: { filter: {}, enrollmentType: 0 },
      languages: [],
      serverSideProps: {},
      tableData: [{ old: true }],
      setLoading: jest.fn()
    }

    EnrollmentsTrainingTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData).toEqual([])
  })

  it('exportEnrollments builds payload and downloads expected file names', async () => {
    if (!globalThis.URL) globalThis.URL = {}
    if (!globalThis.URL.createObjectURL) globalThis.URL.createObjectURL = jest.fn()
    const createdLinks = []
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { click: jest.fn(), href: '', download: '' }
      createdLinks.push(link)
      return link
    })
    const objectUrlSpy = jest.spyOn(globalThis.URL, 'createObjectURL').mockReturnValue('blob:training')

    const ctx = {
      axiosPayload: { orderBy: 'name', ascending: true, filter: {}, enrollmentType: 0 }
    }

    EnrollmentsTrainingTable.methods.exportEnrollments.call(ctx, {
      exportTypes: ['XLS', 'PDF'],
      pageNumber: 1,
      pageSize: 25,
      reportAllPages: false
    })
    await flushPromises()

    expect(AwarenessEducatorService.exportEnrollments).toHaveBeenCalledTimes(2)
    expect(createdLinks[0].download).toBe('Training-List.xlsx')
    expect(createdLinks[1].download).toBe('Training-List.pdf')

    createElementSpy.mockRestore()
    objectUrlSpy.mockRestore()
  })

  it('mounted hook calls callForData', () => {
    const callForData = jest.fn()
    EnrollmentsTrainingTable.mounted.call({ callForData })
    expect(callForData).toHaveBeenCalled()
  })

  it('data uses trash row actions when isTrash is true', () => {
    const tableData = EnrollmentsTrainingTable.data.call({
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
  })

  it('data builds standard row actions when not trash', () => {
    const tableData = EnrollmentsTrainingTable.data.call({
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
  })
})
