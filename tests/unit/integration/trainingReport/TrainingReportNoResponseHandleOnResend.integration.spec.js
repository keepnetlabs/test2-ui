/**
 * Eğitim raporu No Response: toplu/tekil yeniden gönderim (`handleOnResend`)
 * → `resendPayload` + `isShowResendDialog` (`TrainingReportResendDialog`).
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

describe('Training Report No Response handleOnResend (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.noResponseTrainingReportEmails.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              targetUserResourceId: 'tu-nr-resend-1',
              customFieldValues: []
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('builds resendPayload and opens resend dialog on handleOnResend (single row)', async () => {
    const wrapper = mount(TrainingReportNoResponse, {
      localVue,
      vuetify,
      propsData: {
        id: 'tr-nr-resend-1',
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

    const row = { targetUserResourceId: 'tu-nr-resend-solo' }
    wrapper.vm.handleOnResend(row, [], false)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isShowResendDialog).toBe(true)
    expect(wrapper.vm.resendPayload).toEqual({
      selectedItems: ['tu-nr-resend-solo'],
      excludedItems: [],
      selectAll: false,
      filter: wrapper.vm.axiosPayload.filter
    })
  })
})
