/**
 * Smishing kampanya kullanıcı listesi (`TrainingReportUsers`) `mounted`
 * → `AwarenessEducatorService.searchTrainingReportUsers(axiosPayload, id)` (ElTabs içi DataTable).
 */
jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    searchTrainingReportUsers: jest.fn(),
    exportTrainingReportUsers: jest.fn()
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
import CampaignReportUsers from '@/components/SmishingReport/Users/CampaignReportUsers.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Smishing Report Training Users table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.searchTrainingReportUsers.mockResolvedValue({
      data: {
        data: {
          results: [{ resourceId: 'tr-u-1', firstName: 'Ada', status: 'Clicked' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads included users via searchTrainingReportUsers', async () => {
    const wrapper = mount(CampaignReportUsers, {
      localVue,
      vuetify,
      propsData: {
        id: 'sm-tr-1',
        formDetails: {}
      },
      stubs: {
        ElTabs: { name: 'ElTabs', template: '<div class="el-tabs"><slot /></div>' },
        ElTabPane: { name: 'ElTabPane', template: '<div class="el-tab-pane"><slot /></div>' },
        CampaignManagerReportResendDialog: true,
        CampaignReportUserInteractionsModal: true,
        CampaignReportExcludedUsers: true,
        CampaignManagerReportHeader: true,
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn() }
        },
        DefaultButtonRowAction: true,
        Badge: true
      },
      mocks: {
        $store: { getters: {} }
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(AwarenessEducatorService.searchTrainingReportUsers).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1, orderBy: 'email' }),
      'sm-tr-1'
    )
    expect(wrapper.vm.tableData).toHaveLength(1)
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'tr-u-1',
        status: 'Clicked'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
