/**
 * Vishing raporu Answered tablo `mounted`
 * → `getVishingReportAnswered(axiosPayload, id)` + `customFieldValues` satır birleşimi.
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
              firstName: 'Ada',
              phoneNumber: '+1000',
              customFieldValues: [{ name: 'Site', value: 'HQ' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads rows via getVishingReportAnswered and maps custom fields', async () => {
    const wrapper = mount(VishingReportAnswered, {
      localVue,
      vuetify,
      propsData: {
        id: 'vish-camp-answered-1',
        formDetails: {},
        customFields: []
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn(), resetSelectableParams: jest.fn() }
        },
        CampaignManagerReportHeader: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(getVishingReportAnswered).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1 }),
      'vish-camp-answered-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        firstName: 'Ada',
        phoneNumber: '+1000',
        Site: 'HQ'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
