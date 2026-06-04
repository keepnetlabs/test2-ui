/**
 * Vishing Target Users tablo `mounted` → `getVishingReportUsers(axiosPayload, id)`
 * + `customFieldValues` → satır alanları; `exportVishingUsers` mock (indirme tetiklenmez).
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
      orderBy: 'FirstName',
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
              resourceId: 'vish-user-1',
              status: 'Answered',
              customFieldValues: [{ name: 'Ext', value: '101' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads rows via getVishingReportUsers and merges custom fields', async () => {
    const wrapper = mount(VishingReportUsers, {
      localVue,
      vuetify,
      propsData: {
        id: 'vish-camp-1'
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn() }
        },
        CampaignManagerReportHeader: true,
        Badge: true,
        VishingReportUserInteractionsModal: true,
        DefaultButtonRowAction: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(getVishingReportUsers).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1 }),
      'vish-camp-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'vish-user-1',
        status: 'Answered',
        Ext: '101'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
