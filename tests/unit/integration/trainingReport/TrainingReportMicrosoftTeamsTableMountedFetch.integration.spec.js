/**
 * Eğitim raporu Sending — Microsoft Teams: `mounted` + `$nextTick`
 * → `AwarenessEducatorService.searchMicrosoftTeamsSendingReportEmails(axiosPayload, id)`.
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

describe('Training Report Microsoft Teams sending table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.searchMicrosoftTeamsSendingReportEmails.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              id: 'teams-log-1',
              customFieldValues: [{ name: 'TeamId', value: 't1' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads rows after nextTick via searchMicrosoftTeamsSendingReportEmails', async () => {
    const wrapper = mount(TrainingReportMicrosoftTeamsTable, {
      localVue,
      vuetify,
      propsData: {
        id: 'tr-teams-1',
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

    expect(AwarenessEducatorService.searchMicrosoftTeamsSendingReportEmails).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1, orderBy: 'email' }),
      'tr-teams-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        id: 'teams-log-1',
        TeamId: 't1'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
