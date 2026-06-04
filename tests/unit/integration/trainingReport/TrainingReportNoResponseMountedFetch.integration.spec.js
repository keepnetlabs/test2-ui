/**
 * Eğitim raporu No Response tablo `mounted`
 * → `AwarenessEducatorService.noResponseTrainingReportEmails(axiosPayload, id)`
 * + `customFieldValues` → satır alanları.
 */
jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    noResponseTrainingReportEmails: jest.fn(),
    exportNoResponseReportResults: jest.fn(),
    resendTrainingNoResponseList: jest.fn(() => Promise.resolve())
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
import TrainingReportNoResponse from '@/components/AwarenessEducator/TrainingReport/NoResponse/TrainingReportNoResponse.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Training Report No Response table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.noResponseTrainingReportEmails.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              targetUserResourceId: 'tu-nr-1',
              customFieldValues: [{ name: 'Segment', value: 'S1' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads rows via noResponseTrainingReportEmails and merges custom fields', async () => {
    const wrapper = mount(TrainingReportNoResponse, {
      localVue,
      vuetify,
      propsData: {
        id: 'tr-nr-1',
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
        TrainingReportResendDialog: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(AwarenessEducatorService.noResponseTrainingReportEmails).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1, orderBy: 'email' }),
      'tr-nr-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        targetUserResourceId: 'tu-nr-1',
        Segment: 'S1'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
