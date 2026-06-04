/**
 * Eğitim raporu Clicked link: yeniden gönderim (`handleOnResend`)
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

jest.mock('@/utils/helperFunctions', () => {
  const actual = jest.requireActual('@/utils/helperFunctions')
  return {
    ...actual,
    createCustomFieldColumns: jest.fn(() => [])
  }
})

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import TrainingReportClickedTrainingLink from '@/components/AwarenessEducator/TrainingReport/ClickedTrainingLink/TrainingReportClickedTrainingLink.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Training Report Clicked training link handleOnResend (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.clickedTrainingReportEmails.mockResolvedValue({
      data: {
        data: {
          results: [{ targetUserResourceId: 'tu-click-resend-1', customFieldValues: [] }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('builds resendPayload and opens resend dialog on handleOnResend', async () => {
    const wrapper = mount(TrainingReportClickedTrainingLink, {
      localVue,
      vuetify,
      propsData: {
        id: 'tr-click-resend-1',
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

    wrapper.vm.handleOnResend(
      [{ targetUserResourceId: 'a' }, { targetUserResourceId: 'b' }],
      [],
      true
    )
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isShowResendDialog).toBe(true)
    expect(wrapper.vm.resendPayload).toEqual({
      selectedItems: ['a', 'b'],
      excludedItems: [],
      selectAll: true,
      filter: wrapper.vm.axiosPayload.filter
    })
    expect(AwarenessEducatorService.resendTrainingToClickedLinkList).not.toHaveBeenCalled()
  })
})
