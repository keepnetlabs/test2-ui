/**
 * Vishing raporu Target Users tablo `mounted`
 * → `getVishingReportUsers(axiosPayload, id)` + `customFieldValues` satır birleşimi;
 * etkileşim modalı stub (mount sırasında ek API yok).
 */
jest.mock('@/api/vishing', () => ({
  getVishingReportUsers: jest.fn(),
  exportVishingUsers: jest.fn()
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDefaultAxiosPayload: jest.fn(() => ({
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'CreateTime',
      ascending: false,
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
import VishingReportUsers from '@/components/VishingReport/VishingReportUsers.vue'
import { getVishingReportUsers } from '@/api/vishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Vishing Report Users table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    getVishingReportUsers.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              firstName: 'Eve',
              resourceId: 'vish-user-row-1',
              status: 'Answered',
              customFieldValues: [{ name: 'DeptCode', value: 'D1' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads rows via getVishingReportUsers and maps custom fields', async () => {
    const wrapper = mount(VishingReportUsers, {
      localVue,
      vuetify,
      propsData: {
        id: 'vish-camp-users-1',
        customFields: []
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn(), resetSelectableParams: jest.fn() }
        },
        CampaignManagerReportHeader: true,
        VishingReportUserInteractionsModal: true,
        DefaultButtonRowAction: true,
        Badge: true,
        VTooltip: true,
        VBtn: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(getVishingReportUsers).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1 }),
      'vish-camp-users-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        firstName: 'Eve',
        resourceId: 'vish-user-row-1',
        DeptCode: 'D1'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
