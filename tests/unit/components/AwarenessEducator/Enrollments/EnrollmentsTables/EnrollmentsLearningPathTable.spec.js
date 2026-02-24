jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    exportEnrollments: jest.fn(() => Promise.resolve({ data: Buffer.from('x') })),
    searchEnrollments: jest.fn()
  }
}))

import EnrollmentsLearningPathTable from '@/components/AwarenessEducator/Enrollments/EnrollmentsTables/EnrollmentsLearningPathTable.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { trashRowActions } from '@/components/AwarenessEducator/Enrollments/EnrollmentsTables/utils'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('EnrollmentsLearningPathTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('saved key computed returns trash keys when isTrash is true', () => {
    const ctx = { isTrash: true }
    expect(EnrollmentsLearningPathTable.computed.savedFiltersKey.call(ctx)).toBe(
      DEFAULT_SEARCH_CONTAINER_KEYS.TRASH_LEARNING_PATH_LIST
    )
    expect(EnrollmentsLearningPathTable.computed.savedTableSettingsKey.call(ctx)).toBe(
      TABLE_SETTINGS_KEYS.TRASH_LEARNING_PATH_LIST
    )
  })

  it('saved key computed returns standard keys when isTrash is false', () => {
    const ctx = { isTrash: false }
    expect(EnrollmentsLearningPathTable.computed.savedFiltersKey.call(ctx)).toBe(
      DEFAULT_SEARCH_CONTAINER_KEYS.ENROLLMENTS_LEARNING_PATH_LIST
    )
    expect(EnrollmentsLearningPathTable.computed.savedTableSettingsKey.call(ctx)).toBe(
      TABLE_SETTINGS_KEYS.ENROLLMENTS_LEARNING_PATH_LIST
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
                languages: ['en'],
                trainingRoles: [{ roleName: 'Admin' }]
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
      axiosPayload: { filter: {}, enrollmentType: 'LearningPath' },
      languages: [{ code: 'en', isoFriendlyName: 'English' }],
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }

    EnrollmentsLearningPathTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData[0].languages).toEqual(['English'])
    expect(ctx.tableData[0].targetAudience).toEqual(['Admin'])
  })

  it('callForData handles missing results safely', async () => {
    const apiFunc = jest.fn(() => Promise.resolve({ data: { data: {} } }))
    const ctx = {
      apiFunc,
      axiosPayload: {},
      languages: [],
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }

    EnrollmentsLearningPathTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData).toEqual([])
  })

  it('exportEnrollments downloads Learning-Path-List files', async () => {
    if (!globalThis.URL) globalThis.URL = {}
    if (!globalThis.URL.createObjectURL) globalThis.URL.createObjectURL = jest.fn()
    const createdLinks = []
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { click: jest.fn(), href: '', download: '' }
      createdLinks.push(link)
      return link
    })
    const objectUrlSpy = jest.spyOn(globalThis.URL, 'createObjectURL').mockReturnValue('blob:lp')

    const ctx = {
      axiosPayload: { orderBy: 'name', ascending: true, filter: {}, enrollmentType: 'LearningPath' }
    }

    EnrollmentsLearningPathTable.methods.exportEnrollments.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()

    expect(createdLinks[0].download).toBe('Learning-Path-List.xlsx')
    expect(createdLinks[1].download).toBe('Learning-Path-List.csv')

    createElementSpy.mockRestore()
    objectUrlSpy.mockRestore()
  })

  it('mounted hook calls callForData', () => {
    const callForData = jest.fn()
    EnrollmentsLearningPathTable.mounted.call({ callForData })
    expect(callForData).toHaveBeenCalled()
  })

  it('data uses trash row actions when isTrash is true', () => {
    const tableData = EnrollmentsLearningPathTable.data.call({
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
    const tableData = EnrollmentsLearningPathTable.data.call({
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
  })
})
