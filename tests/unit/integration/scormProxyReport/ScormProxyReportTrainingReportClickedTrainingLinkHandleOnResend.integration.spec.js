/**
 * SCORM proxy Clicked link: yeniden gönderim (`handleOnResend`)
 * → `resendPayload` + `isShowResendDialog`.
 */
jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    clickedTrainingReportEmails: jest.fn(),
    exportClickedTrainingReportEmails: jest.fn(),
    resendTrainingToClickedLinkList: jest.fn(() => Promise.resolve())
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

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import TrainingReportClickedTrainingLink from '@/components/ScormProxyReport/ClickedTrainingLink/TrainingReportClickedTrainingLink.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Scorm Proxy Report Clicked Training Link handleOnResend (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.clickedTrainingReportEmails.mockResolvedValue({
      data: {
        data: {
          results: [{ targetUserResourceId: 'scorm-click-rs-1', firstName: 'C1' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('builds resendPayload and opens resend dialog on handleOnResend after callForData', async () => {
    const wrapper = mount(TrainingReportClickedTrainingLink, {
      localVue,
      vuetify,
      propsData: {
        id: 'scorm-click-rs-tr',
        isScormProxy: true,
        isSurvey: false
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn(), resetSelectableParams: jest.fn(), callForData: jest.fn() }
        },
        CampaignManagerReportHeader: true,
        TrainingReportResendDialog: true,
        TrainingReportUserInteractionsModal: true
      }
    })

    wrapper.vm.callForData()
    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    wrapper.vm.handleOnResend({ targetUserResourceId: 'scorm-click-rs-solo' }, ['x'], true)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isShowResendDialog).toBe(true)
    expect(wrapper.vm.resendPayload).toEqual({
      selectedItems: ['scorm-click-rs-solo'],
      excludedItems: ['x'],
      selectAll: true,
      filter: wrapper.vm.axiosPayload.filter
    })
  })
})
