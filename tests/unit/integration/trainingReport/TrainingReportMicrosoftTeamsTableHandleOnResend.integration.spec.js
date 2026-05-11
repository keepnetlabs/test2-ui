/**
 * Eğitim raporu Sending — Microsoft Teams: `handleOnResend(row)`
 * → `selectedRow` + `isShowResendDialog` (tek satır; `resendItem` API bu testte çağrılmaz).
 */
jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    searchMicrosoftTeamsSendingReportEmails: jest.fn(),
    exportSendingReport: jest.fn(),
    resendMicrosoftTeamsSendingReportEmails: jest.fn(() => Promise.resolve())
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
import TrainingReportMicrosoftTeamsTable from '@/components/AwarenessEducator/TrainingReport/SendingReport/TrainingReportMicrosoftTeamsTable.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Training Report Microsoft Teams table handleOnResend (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.searchMicrosoftTeamsSendingReportEmails.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              id: 'teams-log-rs-1',
              targetUserResourceId: 'tu-teams-rs-1',
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

  it('sets selectedRow and opens resend dialog on handleOnResend', async () => {
    const wrapper = mount(TrainingReportMicrosoftTeamsTable, {
      localVue,
      vuetify,
      propsData: {
        id: 'tr-teams-rs-1',
        lastSendingStatusItems: [],
        isScormProxy: false,
        formDetails: {},
        trainingSummary: {},
        isSurvey: false,
        resendDialogTitle: 'Resend',
        bodyTrainingType: 'Training'
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn(), resetSelectableParams: jest.fn() }
        },
        Badge: true,
        TrainingReportResendDialog: true,
        VTooltip: true,
        VBtn: true
      }
    })

    await wrapper.vm.$nextTick()
    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    const row = { id: 'teams-notify-99', targetUserResourceId: 'tu-teams-99' }
    wrapper.vm.handleOnResend(row)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.selectedRow).toEqual(row)
    expect(wrapper.vm.isShowResendDialog).toBe(true)
    expect(AwarenessEducatorService.resendMicrosoftTeamsSendingReportEmails).not.toHaveBeenCalled()
  })
})
