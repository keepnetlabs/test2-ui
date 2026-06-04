/**
 * Eğitim raporu Opened e-posta tablo `mounted`
 * → `AwarenessEducatorService.openedTrainingReportEmails(axiosPayload, id)`
 * + `customFieldValues` / `examStatus` satır birleşimi.
 */
jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    openedTrainingReportEmails: jest.fn(),
    exportOpenedTrainingReportEmails: jest.fn(),
    resendTrainingToOpenedEmailList: jest.fn(() => Promise.resolve())
  }
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDefaultAxiosPayload: jest.fn(() => ({
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'email',
      ascending: true,
      filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
    }))
  }
})

jest.mock('@/utils/helperFunctions', () => {
  const actual = jest.requireActual('@/utils/helperFunctions')
  return {
    ...actual,
    createCustomFieldColumns: jest.fn(() => [])
  }
})

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import TrainingReportOpenedTrainingEmail from '@/components/AwarenessEducator/TrainingReport/OpenedTrainingEmail/TrainingReportOpenedTrainingEmail.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Training Report Opened training email table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.openedTrainingReportEmails.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              targetUserResourceId: 'tu-open-1',
              examStatusName: 'Passed',
              customFieldValues: [{ name: 'DeptCode', value: 'HQ' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads rows via openedTrainingReportEmails and merges custom fields + examStatus', async () => {
    const wrapper = mount(TrainingReportOpenedTrainingEmail, {
      localVue,
      vuetify,
      propsData: {
        id: 'tr-open-1',
        isScormProxy: false,
        trainingSummary: {},
        isSurvey: false
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn(), resetSelectableParams: jest.fn() }
        },
        CampaignManagerReportHeader: true,
        TrainingReportResendDialog: true,
        TrainingReportUserInteractionsModal: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(AwarenessEducatorService.openedTrainingReportEmails).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1, orderBy: 'email' }),
      'tr-open-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        targetUserResourceId: 'tu-open-1',
        examStatus: 'Passed',
        DeptCode: 'HQ'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
