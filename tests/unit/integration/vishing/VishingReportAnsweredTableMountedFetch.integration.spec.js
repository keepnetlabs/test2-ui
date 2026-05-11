/**
 * Vishing Answered tablo `mounted` → `getVishingReportAnswered(axiosPayload, id)`
 * + `customFieldValues` → satır alanları.
 */
jest.mock('@/api/vishing', () => ({
  getVishingReportAnswered: jest.fn(),
  exportVishingAnsweredUsers: jest.fn()
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
import VishingReportAnswered from '@/components/VishingReport/VishingReportAnswered.vue'
import { getVishingReportAnswered } from '@/api/vishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Vishing Report Answered table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    getVishingReportAnswered.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'vish-ans-1',
              customFieldValues: [{ name: 'AnsNote', value: 'a' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads rows via getVishingReportAnswered and merges custom fields', async () => {
    const wrapper = mount(VishingReportAnswered, {
      localVue,
      vuetify,
      propsData: {
        id: 'vish-camp-ans',
        formDetails: {}
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn() }
        },
        CampaignManagerReportHeader: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(getVishingReportAnswered).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1 }),
      'vish-camp-ans'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'vish-ans-1',
        AnsNote: 'a'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
